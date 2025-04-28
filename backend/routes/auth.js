const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// 👈 这里新增 
router.get('/me', verifyToken, getCurrentUser);  

const jwt = require('jsonwebtoken');

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

    // 验证 Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 签发新的 Access Token
    const newAccessToken = jwt.sign(
      { id: decoded.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

  
module.exports = router;
