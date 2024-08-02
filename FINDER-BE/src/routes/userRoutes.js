const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile', authMiddleware,  userController.updateProfile);
router.get('/get/profile', authMiddleware,  userController.getProfile);
router.post('/nearby', authMiddleware,  userController.getNearbyUsers);
router.post('/search', authMiddleware,  userController.searchUsers);
router.post('/like', authMiddleware, userController.likeUser);
router.post('/dislike', authMiddleware, userController.dislikeUser);

module.exports = router;
