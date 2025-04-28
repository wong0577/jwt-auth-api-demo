import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [email, setEmail] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/profile');
        setEmail(res.data.email);
        setAvatarUrl(res.data.avatar || 'https://i.pravatar.cc/150?img=12'); // 默认头像
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const handleEdit = () => {
    Alert.alert('编辑资料', '这里可以跳转到 EditProfile 页面或弹出表单。');
    // navigation.navigate('EditProfile'); // 如果你准备开发编辑页
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{email || '加载中...'}</Text>

      <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
        <Text style={styles.editText}>✏️ 编辑资料</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>
        <Button title="🚪 退出登录" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  editBtn: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  editText: {
    color: '#007bff',
    fontWeight: '500',
  },
});
