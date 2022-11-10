const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();
const { NOT_FOUND_CODE } = require('./utils/constants');

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(cardsRouter);
app.use(usersRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'PAGE NOT FOUND' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
