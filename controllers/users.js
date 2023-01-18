const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, userUpdateOptions } = require('../utils/config');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const LoginError = require('../errors/login-error');
const ExistingUserError = require('../errors/existing-user-error');
const AuthError = require('../errors/auth-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if(!user) {
        throw new NotFoundError('User ID not found');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ExistingUserError('There is already a user with that email');
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, avatar, email, password: hash,
      })
      .then(() => {
       return res.status(201).send({ data: { name, avatar, email } })
      })
    )
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if(!user) {
        throw new LoginError('Incorrect email or password');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      if(!user) {
        throw new NotFoundError('User ID not found');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const updates = req.body;

  User.findByIdAndUpdate(userId, updates, userUpdateOptions)
    .orFail()
    .then((user) => {
      if(!user) {
        throw new NotFoundError('User ID not found');
      }
      res.send(user)
    })
    .catch(next);
};
