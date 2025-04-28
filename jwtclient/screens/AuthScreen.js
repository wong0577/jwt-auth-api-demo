import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { login, register } from '../api/api';
import { useNavigation } from '@react-navigation/native';
export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await login({
          email: data.email,
          password: data.password,
        });
        navigation.replace('Home');
      } else {
        await register({
          email: data.email,
          password: data.password,
          username: data.username,
        });
  
        // 注册后直接登录（只要 email/password）
        await login({
          email: data.email,
          password: data.password,
        });
        // 存储Token
        await AsyncStorage.setItem('accessToken', loginData.accessToken);
        await AsyncStorage.setItem('refreshToken', loginData.refreshToken);

        Alert.alert('注册成功 ✅', '欢迎你！');
        
        setUser(loginData.user);
        //navigation.replace('Home');
      }
    } catch (err) {
      console.log('==== FULL ERROR ====');
      console.log(JSON.stringify(err.response?.data, null, 2)); // 打印完整错误内容！

      const errorMessage =
        err.response?.data?.message || // 后端自定义返回的 message
        err.response?.data || // 后端直接返回的数据
        err.message || // axios 内置 message
        '发生未知错误'; // 都没有就显示默认

      Alert.alert('错误', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? '登录' : '注册新用户'}</Text>

      {/* 邮箱 */}
      <Controller
        control={control}
        name="email"
        rules={{ required: '邮箱不能为空', pattern: { value: /\S+@\S+\.\S+/, message: '邮箱格式错误' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="邮箱"
            value={value ?? ''}  // 🔥 加一层保护，防止 undefined
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, errors.email && styles.inputError]}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* 昵称，仅注册模式下显示 */}
      {!isLogin && (
        <>
          <Controller
            control={control}
            name="username"
            rules={{ required: '昵称不能为空' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="昵称"
                value={value ?? ''}  // 🔥 加一层保护，防止 undefined
                onChangeText={onChange}
                style={[styles.input, errors.username && styles.inputError]}
              />
            )}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
        </>
      )}

      {/* 密码 */}
      <Controller
        control={control}
        name="password"
        rules={{ required: '密码不能为空', minLength: { value: 6, message: '密码至少6位' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="密码" 
            value={value ?? ''}  // 🔥 加一层保护，防止 undefined
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            style={[styles.input, errors.password && styles.inputError]}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* 显示密码切换 */}
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassBtn}>
        <Text style={styles.togglePassText}>{showPassword ? '🙈 隐藏密码' : '👁 显示密码'}</Text>
      </TouchableOpacity>

      {/* 提交按钮 */}
      <Button title={isLogin ? '登录' : '注册'} onPress={handleSubmit(onSubmit)} />

      {/* 模式切换 */}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
        <Text style={styles.switchText}>
          {isLogin ? '没有账号？去注册 ➡️' : '已有账号？去登录 ➡️'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
  switchBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#007bff',
    fontWeight: '500',
  },
  togglePassBtn: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  togglePassText: {
    color: '#007bff',
    fontSize: 13,
  },
  socialBtn: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  socialText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
