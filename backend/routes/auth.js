const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// 👈 这里新增 
router.get('/me', verifyToken, getCurrentUser);  
router.post('/refresh', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(401).json({ error: 'No token provided' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  });

  
module.exports = router;
