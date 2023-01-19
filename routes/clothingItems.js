const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/validateUrl');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');

router.get('/', getClothingItems);

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid('hot', 'warm', 'cold', 'sunny'),
    imageUrl: Joi.string().required().custom(validateUrl),
  }),
}), createClothingItem);

router.delete('/:itemId', auth, celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
}), deleteClothingItem);

router.put('/:itemId/likes', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), likeItem);

router.delete('/:itemId/likes', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), dislikeItem);

module.exports = router;
