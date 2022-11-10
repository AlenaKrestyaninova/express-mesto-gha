const express = require('express');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
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

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/,
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

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
