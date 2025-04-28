import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, register as registerApi, getProfile, logout as logoutApi } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // 用户信息
  const [loading, setLoading] = useState(true); // 加载状态

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('📦 accessToken:', token);
      if (token) {
        try {
          const profile = await getProfile();
          console.log('👤 用户资料:', profile);
          setUser(profile);
        } catch (err) {
          console.log('❌ 获取 profile 失败', err);
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        }
      }
      setLoading(false);
    };

    init(); // ✅ 一定要调用 init()
  }, []);

  const login = async ({ email, password }) => {
    await loginApi({ email, password });
    const profile = await getProfile();
    setUser(profile); 
  };
  
  const register = async ({ email, password, username }) => {
    await registerApi({ email, password, username });
    await login({ email, password });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log('⚠️ 登出 API 出错，但继续清理本地Token', error);
    }
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
    console.log('👋 已登出并清理Token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 在组件中使用 useAuth() 获取登录状态与方法
export const useAuth = () => useContext(AuthContext);
