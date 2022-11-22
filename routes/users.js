const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/me', auth, getCurrentUser);
router.post('/me', auth, updateUser);

module.exports = router;
