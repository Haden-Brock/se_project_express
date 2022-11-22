const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, userUpdateOptions } = require('../utils/config');
const handleError = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error('ExistingUser'));
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ data: { name, avatar, email } }))
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      err.name = 'LoginError';
      handleError(err, res);
    });
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleError(err, res);
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  User.findByIdAndUpdate(userId, updates, userUpdateOptions)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      handleError(err, res);
    });
};
