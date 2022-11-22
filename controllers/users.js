const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, userUpdateOptions } = require('../utils/config.js');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server.' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User ID not found.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID format.' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  
  User.findOne({ email })
  .then((user) => {
    if(user) {
      return Promise.reject(new Error('ExistingUser'));
    } 
    
    return bcrypt.hash(password, 10)
  })
  .then((hash) => {
    return User.create({ name, avatar, email, password: hash })
  })
  .then((user) => res.status(201).send({ data: user }))
  .catch((err) => {
    if(err.message === 'ExistingUser') {
      res.status(409).send({ message: 'There is already a user with that email.'});
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Invalid data for user creation.' });
    } else {
      res.status(500).send({ message: 'An error has occurred on the server.'});
    }
  })
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d',});
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message});
    });
}

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User ID not found.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID format.' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    })
}

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  User.findByIdAndUpdate(userId, updates, userUpdateOptions)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User ID not found.' });
      } else if (err.name === 'CastError' || 'ValidationError') {
        res.status(400).send({ message: 'Invalid ID format.' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server.' });
      }
    })
}
