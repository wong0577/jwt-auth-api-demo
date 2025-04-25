const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// 模拟的用户数据存储（正式项目请连接数据库）
let users = [];

// 注册接口
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: '用户名已存在' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role: role || 'user',
  };
  users.push(newUser);

  res.status(201).json({ message: '注册成功' });
});

// 登录接口
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email  === email );
  if (!user) return res.status(400).json({ message: '用户名不存在' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: '密码错误' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// 获取当前用户信息（受保护路由）
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;