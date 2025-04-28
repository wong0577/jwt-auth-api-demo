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

/jwt-auth-app/
├── App.js                         // App入口，包裹AuthProvider + AppNavigator
│
├── /contexts/
│   └── AuthContext.js              // 登录状态管理器（user, login, register, logout）
│
├── /navigation/
│   └── AppNavigator.js             // 统一管理页面跳转（登录/主页/底部Tab）
│
├── /screens/
│   ├── AuthScreen.js               // 登录/注册页
│   ├── HomeScreen.js               // 首页（欢迎回来 + header登出icon）
│   ├── ProfileScreen.js            // 个人资料页
│   └── SettingsScreen.js           // 设置页（带登出按钮）
│
├── /api/
│   ├── api.js                      // 封装 login, register, logout, getProfile
│   └── axiosInstance.js            // 封装 axios，自动加token、自动续签
│
├── /assets/
│   └── （可放logo、图片等资源）
│
├── /components/
│   └── （可放自定义小组件，例如Button组件、Card组件）
│
├── package.json                    // 项目信息
├── app.json                        // Expo专用配置（如果是Expo项目）
└── README.md                       // 项目说明文档


页面                            | 功能
AuthScreen                      | 登录/注册（+切换模式按钮）
HomeScreen                      | 欢迎回来 + 顶栏登出icon
ProfileScreen                   | 显示用户名、邮箱、角色
SettingsScreen                  | 显示设置 + 退出登录按钮
AppNavigator                    | 登录判断，跳到 Tab 还是登录页
AppTabs (BottomTabNavigator)    | Home / Profile / Settings 三个底部导航


App.js
  ⬇️
<AuthProvider> (自动读取token)
  ⬇️
<AppNavigator>
  ⬇️
(user存在?)
    ├── ❌ 没有user ➔ 进入 AuthScreen (登录/注册页)
    └── ✅ 有user ➔ 进入 MainApp (底部Tab)

MainApp (BottomTab)
  ├── HomeScreen (首页)
  ├── ProfileScreen (用户资料)
  └── SettingsScreen (退出登录)


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