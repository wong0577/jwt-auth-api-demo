import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ✅ 引入Material图标

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '首页', // ✅ 标题
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
          <Icon name="logout" size={24} color="#007bff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>未登录</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>欢迎回来，{user.username || user.email}！</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
