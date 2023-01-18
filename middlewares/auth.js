const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const LoginError = require('../errors/login-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginError('Incorrect email or password');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(err);
  }

  req.user = payload;

  return next();
};
