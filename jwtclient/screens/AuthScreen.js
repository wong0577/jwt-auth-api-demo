import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'; // ✅ 用AuthContext

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false); // 🔥 新增loading防止重复提交
  const navigation = useNavigation();
  const { login, register } = useAuth(); // ✅ 用context提供的 login 和 register

  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (isLogin) {
        await login({ email: data.email, password: data.password });
        navigation.replace('MainApp'); // ✅ login成功，user已存在，Home注册了
      } else {
        await register({ email: data.email, password: data.password, username: data.username });
        navigation.replace('MainApp');
      }
    } catch (err) {
      console.log('==== FULL ERROR ====');
      console.log(JSON.stringify(err.response?.data, null, 2));

      const errorMessage =
        err.response?.data?.error || 
        err.response?.data?.message ||
        err.message ||
        '发生未知错误';
      
      Alert.alert('错误', errorMessage);
    } finally {
      setSubmitting(false);
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
            value={value ?? ''}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, errors.email && styles.inputError]}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* 昵称（仅注册时显示） */}
      {!isLogin && (
        <>
          <Controller
            control={control}
            name="username"
            rules={{ required: '昵称不能为空' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="昵称"
                value={value ?? ''}
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
            value={value ?? ''}
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
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, submitting && { opacity: 0.6 }]}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? '登录' : '注册'}</Text>
        )}
      </TouchableOpacity>

      {/* 切换模式 */}
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
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
});
