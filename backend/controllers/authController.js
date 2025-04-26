const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/userModel');

// 注册
exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    username,
    password: hashedPassword,
    role: 'user'
  };

  users.push(newUser);

  res.json({ message: 'User registered successfully' });
};

// 登录
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

// 👇 新增
exports.getCurrentUser = (req, res) => {
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  });
};
