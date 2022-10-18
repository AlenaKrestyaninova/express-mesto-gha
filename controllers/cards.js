const Card = require('../models/card');

//  Получаем все карточки  //
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//  Создаем карточку  //
const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

//  Удаляем карточку  //
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Card with this id not found' });
      }
      res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//  Ставим лайк  //
const likeCard = (req, res) => {
  console.log(req.params.cardId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Card with this id not found' });
      }
      res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//  Удаляем лайк  //
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
