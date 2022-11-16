const Card = require('../models/card');
const ValidationError = require('../utils/errors/ValidationError'); // 400
const NotFoundError = require('../utils/errors/NotFoundError'); // 404
const NotAllowedError = require('../utils/errors/NotAllowedError'); // 403

//  Получаем все карточки  //
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

//  Создаем карточку  //
const createCard = (req, res, next) => {
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
        next(new ValidationError('Not correct data'));
        return;
      }
      next(err);
    });
};

//  Удаляем карточку  //
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card with this id not found'));
        return;
      }
      if (req.user._id !== card.owner._id.toString()) {
        next(new NotAllowedError('You can not delete this card'));
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => { res.send(card); })
        .catch((err) => { next(err); });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Not correct data'));
        return;
      }
      next(err);
    });
};

//  Ставим лайк  //
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Card with this id not found'));
        return;
      }
      res.send({ message: 'Like added' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Not correct data'));
        return;
      }
      next(err);
    });
};

//  Удаляем лайк  //
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Card with this id not found'));
        return;
      }
      res.send({ message: 'Like deleted' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Not correct data'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
