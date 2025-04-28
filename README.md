# JWT Auth Demo App

一个基于 React Native + JWT认证 的移动端登录/注册Demo项目。

支持功能：

✅ 用户注册  
✅ 用户登录  
✅ 自动登录（读取本地token）  
✅ 自动刷新token  
✅ 退出登录  
✅ 底部Tab导航（Home / Profile / Settings）  
✅ 错误信息清楚显示

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

## 技术栈

- React Native (Expo)
- React Navigation
- Axios
- Context API (全局管理Auth状态)
- AsyncStorage (本地存储token)

后端API托管在 Railway，使用JWT认证。

---

## 安装和运行

1. 克隆项目

```bash
git clone https://github.com/你的GitHub用户名/jwt-auth-app.git
cd jwt-auth-app
