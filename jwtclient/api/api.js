// jwtclient/api/api.js
import axios from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 注册
export const register = async ({ email, password, username }) => {
  const res = await axios.post('/register', { email, password, username });
  return res.data;
};

// 登录
export const login = async ({ email, password }) => {
  const res = await axios.post('/login', { email, password });

  const { accessToken, refreshToken } = res.data;
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return res.data;
};

// 获取当前用户资料
export const getProfile = async () => {
  const res = await axios.get('/me');
  return res.data;
};

// 登出
export const logout = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};
