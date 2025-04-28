import axios from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 注册
export const register = async ({ email, password, username }) => {
  const res = await axios.post('/register', { email, password, username });
  return res.data;
};

// 登录（基于邮箱登录）
export const login = async ({ email, password }) => {
  const res = await axios.post('/login', { email, password });

  const { accessToken, refreshToken } = res.data;
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);

  return res.data;
};

// ✅ 获取当前用户信息
export const getProfile = async () => {
  const res = await axios.get('/me');
  console.log(res.data);
  return res.data;
};

// ✅ 更新用户资料
export const updateProfile = async ({ username, avatar }) => {
  const res = await axios.put('/me', { username, avatar });
  return res.data;
};

// ✅ 登出：清除 token + 告知后端
export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  await axios.post('/logout', { token: refreshToken });
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};
