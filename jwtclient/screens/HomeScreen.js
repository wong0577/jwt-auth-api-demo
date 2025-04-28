import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text>欢迎回来：{user?.username || user?.email}</Text>
      <Button title="退出登录" onPress={logout} />
    </View>
  );
}
