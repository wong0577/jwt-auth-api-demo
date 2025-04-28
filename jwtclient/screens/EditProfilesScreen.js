import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // 载入当前用户信息
    const loadProfile = async () => {
      try {
        const res = await axios.get('/profile');
        setUsername(res.data.username || '');
        setAvatar(res.data.avatar || 'https://i.pravatar.cc/150?img=12');
      } catch (err) {
        console.error(err);
        Alert.alert('错误', '无法加载用户资料');
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('/profile', {
        username,
        avatar,
      });
      Alert.alert('保存成功', '用户资料已更新');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('保存失败', err.response?.data?.message || '发生错误');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>头像链接：</Text>
      <Image source={{ uri: avatar }} style={styles.avatarPreview} />
      <TextInput
        value={avatar}
        onChangeText={setAvatar}
        placeholder="输入头像图片 URL"
        style={styles.input}
      />

      <Text style={styles.label}>昵称：</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="输入昵称"
        style={styles.input}
      />

      <Button title="保存修改" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
});
