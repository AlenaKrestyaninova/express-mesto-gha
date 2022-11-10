const { celebrate, Joi } = require('celebrate');

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[\wА-Яа-я-]+\.[\wА-Яа-я-]{2,8}(\/?[\w\-._~:/?#[\]@!$&'()*+,;=]*)*/),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateCard,
  validateCardId,
};
