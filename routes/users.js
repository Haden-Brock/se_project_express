const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');

router.get('/me', getCurrentUser);

module.exports = router;
