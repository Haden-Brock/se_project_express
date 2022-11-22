const { JWT_SECRET } = require('../utils/config.js');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'No Auth' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Bad Auth' });
  }

  req.user = payload;

  next();
};