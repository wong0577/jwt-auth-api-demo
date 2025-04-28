// jwtclient/api/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://jwt-auth-api-demo-production.up.railway.app/api'; // 改成你的后端API

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⏩ 请求拦截器：自动加 accessToken
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 响应拦截器：遇到 401 自动刷新 token 并重试
instance.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const res = await axios.post(`${baseURL}/refresh`, { refreshToken });
        const newAccessToken = res.data.accessToken;

        await AsyncStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        console.error('Token refresh failed. Redirect to login.');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
