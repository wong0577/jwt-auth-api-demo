import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { register } from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      await register({ email, password, username });
      Alert.alert('注册成功 🎉', '请登录账号继续', [
        {
          text: '去登录',
          onPress: () => navigation.replace('Login'), // 或 navigate
        },
      ]);
    } catch (err) {
      Alert.alert('注册失败', err.response?.data?.message || '请检查网络');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>注册新用户</Text>

      <TextInput
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 12, padding: 10 }}
      />

      <TextInput
        placeholder="昵称"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 12, padding: 10 }}
      />

      <TextInput
        placeholder="密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <Button title="注册" onPress={handleRegister} />
    </View>
  );
}
