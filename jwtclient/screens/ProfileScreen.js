import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>未登录</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>个人资料</Text>
      <Text style={styles.info}>用户名: {user.username}</Text>
      <Text style={styles.info}>邮箱: {user.email}</Text>
      <Text style={styles.info}>角色: {user.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 12,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
});
