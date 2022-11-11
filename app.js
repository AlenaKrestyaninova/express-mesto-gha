const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { validateLogin, validateUserCreate } = require('./middlewares/userValidation');
const auth = require('./middlewares/auth');
const serverError = require('./utils/serverError');
const NotFoundError = require('./utils/errors/NotFoundError'); // 404

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreate, createUser);

app.use(auth);

app.use(cardsRouter);
app.use(usersRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('PAGE NOT FOUND'));
});
app.use(errors());
app.use(serverError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
