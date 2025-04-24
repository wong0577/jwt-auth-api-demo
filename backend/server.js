const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 登录 API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'testuser' && password === '123456') {
    return res.json({ token: 'fake-jwt-token' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// 注册 API（示意）
app.post('/api/register', (req, res) => {
  res.json({ message: 'User registered (mock)' });
});

// 获取用户信息
app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization;
  if (auth === 'Bearer fake-jwt-token') {
    return res.json({ username: 'testuser', role: 'VIP' });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

// 根路径
app.get('/', (req, res) => {
  res.send('JWT Auth API is running ✅');
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
