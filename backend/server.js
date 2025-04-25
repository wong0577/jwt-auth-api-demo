const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

// 默认首页
app.get('/', (req, res) => {
  res.send('JWT Auth API is running ✅');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});