import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // ✅ 错误信息 state

  const { login, register } = useAuth();
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setErrorMessage(''); // 清除上次的错误

      if (isLogin) {
        await login({ email: data.email, password: data.password });
      } else {
        await register({ email: data.email, password: data.password, username: data.username });
      }

    } catch (err) {
      console.log('登录/注册失败', err);

      let message = '发生未知错误';
      if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setErrorMessage(message); // ✅ 设置错误信息到页面
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? '登录' : '注册新用户'}</Text>

      {/* 邮箱输入 */}
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

      {/* 昵称输入（注册时才显示） */}
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

      {/* 密码输入 */}
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

      {/* 登录/注册按钮 */}
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

      {/* 错误信息显示 */}
      {errorMessage !== '' && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

      {/* 切换 登录/注册 按钮 */}
      <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setErrorMessage(''); }} style={styles.switchBtn}>
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
  errorMessage: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
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
