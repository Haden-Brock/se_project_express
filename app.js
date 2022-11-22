const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const cors = require('cors');

const { PORT = 3001 } = process.env;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/items', require('./routes/clothingItems'));



app.use((req, res) => {
  const err = new Error('NotFound');
  err.status = 404;
  res.status(404).send({ message: 'The requested page does not exist' });
});

app.listen(PORT, () => {
  console.log(`App listening at port: ${PORT}`);
});
