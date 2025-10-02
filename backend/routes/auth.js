const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6+ chars').isLength({ min: 6 })
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email', 'Please include valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  authController.login
);

// protected route to get current user
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
