const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', authenticateToken, getAllUsers);

// Example of a protected route using your middleware
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
});

module.exports = router;