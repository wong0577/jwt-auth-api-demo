# JWT Auth API - Node.js + Express 后端

这是一个使用 Node.js + Express 实现的简单用户认证 API，支持注册、登录与 JWT 授权机制。

---

## 🚀 启动指南

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
请创建 `.env` 文件，内容如下：

```env
PORT=5000
JWT_SECRET=your-super-secret-key
```

你也可以直接使用已经提供的 `.env` 文件。

### 4. 启动开发服务器
```bash
node server.js
# 或使用 nodemon（推荐）
npx nodemon server.js
```

---

## 🔐 API 接口

| 路由             | 方法 | 描述         | 是否需要 JWT |
|------------------|------|--------------|---------------|
| `/api/register`  | POST | 注册用户         | 否            |
| `/api/login`     | POST | 登录并获取 token | 否        |
| `/api/me`        | GET  | 获取当前用户     | ✅ 是         |

---

## 📦 项目结构
```
backend/
├── controllers/
│   └── authController.js         # 注册、登录、获取当前用户的逻辑
│
├── middleware/
│   └── authMiddleware.js         # 验证 JWT Token 的中间件
│
├── models/
│   └── userModel.js              # 简单的内存数据库 (users数组)
│
├── routes/
│   └── auth.js                   # API 路由：/register, /login, /me
│
├── .env                          # 环境变量 (JWT_SECRET)
│
├── package.json                  # npm 配置
│
├── server.js                     # 主入口文件，挂载路由
│
└── README.md                     # 项目说明 (可选，但建议写)
```

---

## 🧪 示例测试（使用 curl）
```bash
# 注册
curl -X POST http://localhost:5000/api/register \
 -H "Content-Type: application/json" \
 -d '{"username":"user1", "password":"pass", "role":"VIP"}'

# 登录
curl -X POST http://localhost:5000/api/login \
 -H "Content-Type: application/json" \
 -d '{"username":"user1", "password":"pass"}'

# 获取用户信息（替换 YOUR_TOKEN）
curl http://localhost:5000/api/me \
 -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🤝 联系方式

如需技术协助请联系你的开发支持。