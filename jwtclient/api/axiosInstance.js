import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://jwt-auth-api-demo-production.up.railway.app/api'; // 改成你的后端地址

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⏩ 请求拦截器：自动加上 access token
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 响应拦截器：遇到 401 自动尝试刷新 token 并重试
instance.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;

    // 如果是 token 过期且还没尝试刷新
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        const res = await axios.post(`${baseURL}/refresh`, { token: refreshToken });
        const newAccessToken = res.data.accessToken;

        // 存储新 access token
        await AsyncStorage.setItem('accessToken', newAccessToken);

        // 更新 header 并重试请求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        // 刷新失败，强制登出（可跳转登录页）
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        console.error('Token refresh failed. Redirect to login.');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
