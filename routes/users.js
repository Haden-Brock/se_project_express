const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const validateUrl = require('../utils/validateUrl');

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }),
}), updateUser);

module.exports = router;
