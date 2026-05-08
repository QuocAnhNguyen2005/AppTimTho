import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { loginAPI, registerCustomerAPI } from '../../services/authService';
import { API_BASE_URL } from '../../config/api';

export default function CustomerAuth({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone || !password) {
      return Alert.alert('Thiếu thông tin', 'Vui lòng nhập Số điện thoại và Mật khẩu');
    }
    setIsLoading(true);
    const result = await loginAPI(phone, password);
    setIsLoading(false);

    if (!result.success) {
      return Alert.alert(
        'Đăng nhập thất bại',
        `${result.error}\n\n📡 Đang kết nối đến:\n${API_BASE_URL}\n\nKiểm tra:\n• Backend đang chạy (node index.js)\n• Điện thoại & máy tính cùng Wi-Fi`
      );
    }

    if (result.role !== 'customer' && result.role !== 'admin') {
      return Alert.alert(
        'Sai vai trò',
        result.role === 'worker'
          ? 'Tài khoản này là Thợ. Vui lòng đăng nhập ở phần "Tôi là Thợ".'
          : 'Sai vai trò đăng nhập.'
      );
    }

    login('customer', result.user);
    // Chuyển hướng sau khi đăng nhập thành công
    router.replace('/(customer)/home');
  };

  const handleRegister = async () => {
    if (!fullName || !phone || !password) {
      return Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ Họ tên, SĐT và Mật khẩu');
    }
    if (password.length < 6) {
      return Alert.alert('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự');
    }

    setIsLoading(true);
    const result = await registerCustomerAPI(fullName, phone, password);
    setIsLoading(false);

    if (!result.success) {
      return Alert.alert('Đăng ký thất bại', result.error);
    }

    Alert.alert('Đăng ký thành công!', 'Tài khoản đã được tạo. Hãy đăng nhập.', [
      { text: 'OK', onPress: () => { setMode('login'); setFullName(''); setPassword(''); } }
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
      <Text style={styles.subtitle}>
        {mode === 'login' ? 'Chào mừng bạn quay lại!' : 'Tạo tài khoản chỉ mất 30 giây'}
      </Text>

      <View style={styles.form}>
        {mode === 'register' && (
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Họ và Tên"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={mode === 'login' ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
          )}
        </TouchableOpacity>

        {/* Debug info - chỉ hiện khi __DEV__ */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => Alert.alert('Debug Info', `API URL:\n${API_BASE_URL}`)}
          >
            <Text style={styles.debugText}>📡 Kiểm tra kết nối</Text>
          </TouchableOpacity>
        )}

        <View style={styles.switchModeContainer}>
          <Text style={styles.switchModeText}>
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          </Text>
          <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setPassword(''); }}>
            <Text style={styles.switchModeAction}>
              {mode === 'login' ? ' Đăng ký ngay' : ' Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8, marginTop: 40 },
  subtitle: { fontSize: 16, color: '#E0F0FF', marginBottom: 32 },
  form: {
    backgroundColor: '#fff', padding: 24, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 12,
    height: 56, backgroundColor: '#F8F9FA', marginBottom: 16,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  primaryButton: {
    backgroundColor: '#0066CC', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  debugButton: {
    marginTop: 12, paddingVertical: 8, alignItems: 'center',
    backgroundColor: '#F0F0F0', borderRadius: 8,
  },
  debugText: { fontSize: 12, color: '#666' },
  switchModeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchModeText: { color: '#666', fontSize: 15 },
  switchModeAction: { color: '#0066CC', fontSize: 15, fontWeight: 'bold' },
});
