const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} = require('../controllers/users');
const { validateUserId, validateProfileUpdate, validateAvatar } = require('../middlewares/userValidation');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', validateUserId, getUserById);

router.patch('/users/me', validateProfileUpdate, updateProfile);

router.patch('/users/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
