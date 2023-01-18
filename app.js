const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const { celebrate, Joi, errors } = require('celebrate');
const { validateUrl } = require('./utils/validateUrl');
const { PORT = 3000 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30), 
    // avatar: Joi.string().required().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2)
  })
}), createUser);

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));

app.use(errorLogger)
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error has occurred on the server'
        : message 
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port: ${PORT}`);
});
