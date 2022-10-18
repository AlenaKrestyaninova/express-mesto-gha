const express = require('express');
const mongoose = require('mongoose');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '634d96107b42e74be56fa4cc',
  };
  next();
});

app.use(cardsRouter);
app.use(usersRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
