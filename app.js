const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const { PORT = 3001 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use((req, res, next) => {
    req.user = {
      _id: '63670c809dee89ca0eec5dc7'
    };
    next();
});

app.use('/users', require('./routes/users'));

app.use('/items', require('./routes/clothingItems'));

app.use((req, res, next) => {
    const err = new Error("NotFound");
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: 'Cannot be found.'
    });
});

app.listen(PORT, () => {
    console.log(`App listening at port: ${PORT}`);
});



