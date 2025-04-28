// jwtclient/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister, getProfile, logout as apiLogout } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const profile = await getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error('自动登录失败', error);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        setUser(null);  // ⛔ 失败一定要setUser(null)，避免假装登录成功
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async ({ email, password }) => {
    await apiLogin({ email, password });
    const profile = await getProfile();
    setUser(profile);
  };

  const register = async ({ email, password, username }) => {
    await apiRegister({ email, password, username });
    await login({ email, password }); // 注册后自动登录
  };

  const logout = async () => {
    try {
      await apiLogout(); // ✅ 注意是 apiLogout() 小写a
      setUser(null);
    } catch (error) {
      console.error('登出出错，但本地仍然清理', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
