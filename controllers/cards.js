const {
  WRONG_DATA_CODE, // 400
  NOT_FOUND_CODE, // 404
  ERROR_SERVER_CODE, // 500
} = require('../utils/constants');
const Card = require('../models/card');

//  Получаем все карточки  //
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Создаем карточку  //
const createCard = (req, res) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Удаляем карточку  //
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный id карточки', err });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Ставим лайк  //
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный id карточки', err });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Удаляем лайк  //
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный id карточки', err });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
