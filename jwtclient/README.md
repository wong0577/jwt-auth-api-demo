# 📱 JWT Client App (React Native + Expo)

基于 **Expo + React Native** 构建的移动端 App，配合后端 Express API，实现完整的 JWT 用户登录认证系统。

支持注册、登录、Token 本地持久化、刷新 Token、资料修改等功能，并支持连接线上部署的后端（如 Railway）。

---

## 🔧 技术栈

- **React Native (via Expo)**
- **React Navigation** – 页面跳转
- **Axios** – 请求后端 API
- **React Hook Form** – 表单验证
- **AsyncStorage** – 本地保存 accessToken / refreshToken
- **JWT (JSON Web Token)** – 身份认证机制

npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack
npm install axios react-native-toast-message

---

## 📂 项目结构

 jwtclient/
├── App.js                    # App 入口，包裹 AuthProvider + 路由器
├── index.js                  # Expo 入口（main: "index.js" 时启用）
├── package.json              # 项目配置及依赖
├── babel.config.js           # Babel 转译配置
├── assets/                   # 图片、图标、启动页等资源

├── api/
│   ├── axiosInstance.js      # 配置 axios 实例（baseURL + token 拦截）
│   └── api.js                # 登录、注册、获取资料等封装 API 请求方法

├── contexts/
│   └── AuthContext.js        # 管理全局登录状态、token、用户信息

├── navigation/
│   └── AppNavigator.js       # 页面导航器（根据 user 决定跳转 Auth or Home）

├── screens/
│   ├── AuthScreen.js         # 登录 + 注册页（切换模式）
│   ├── HomeScreen.js         # 登录成功后的首页（欢迎语、登出）
│   ├── ProfileScreen.js      # 用户信息展示页（头像、昵称）
│   └── EditProfileScreen.js  # 修改用户昵称、头像等资料

└── utils/                    # 可选工具函数目录（比如 token 管理、验证工具等）



---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourname/jwt-auth-api-demo.git
cd jwt-auth-api-demo/jwtclient

设置 API 后端地址
const baseURL = 'https://your-backend-api.up.railway.app';


🔐 身份认证流程
✅ 注册 ➜ 自动登录 ➜ 进入首页
✅ 登录 ➜ 保存 accessToken & refreshToken 至 AsyncStorage
✅ 请求时自动带上 Authorization: Bearer token
✅ accessToken 过期 ➜ 自动刷新 ➜ 重试原请求
✅ 登出 ➜ 清除所有本地 token


☁️ 后端配套项目（可选）
JWT 后端 API 项目 (Node.js + Express)
使用 Railway 部署
接口包括 /login, /register, /profile, /refresh, /logout

🛡 安全说明
所有 API 请求通过 HTTPS（使用 Railway 自动配置）
accessToken 仅用于短期访问，refreshToken 仅用于刷新，存储在 AsyncStorage 中
登出时主动清除两者，防止泄露