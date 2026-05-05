import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function CustomerAuth({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleAction = async () => {
    setIsLoading(true);
    // Giả lập kết nối Supabase
    setTimeout(() => {
      setIsLoading(false);
      login('customer');
    }, 1500);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('customer');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
      <Text style={styles.subtitle}>
        {mode === 'login' ? 'Chào mừng bạn quay lại!' : 'Không cần nhập nhiều, tìm thợ ngay!'}
      </Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
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
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {mode === 'login' && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
          )}
        </TouchableOpacity>

        {mode === 'login' && (
          <>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Hoặc đăng nhập nhanh bằng</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={handleSocialLogin}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, { marginTop: 12 }]} onPress={handleSocialLogin}>
              <View style={styles.zaloIconMock}>
                <Text style={styles.zaloIconText}>Zalo</Text>
              </View>
              <Text style={styles.socialButtonText}>Tiếp tục với Zalo</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.switchModeContainer}>
          <Text style={styles.switchModeText}>
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          </Text>
          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchModeAction}>
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0F0FF',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
    backgroundColor: '#F8F9FA',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#666',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    height: 56,
    backgroundColor: '#fff',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  zaloIconMock: {
    backgroundColor: '#0068FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  zaloIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchModeText: {
    color: '#666',
    fontSize: 15,
  },
  switchModeAction: {
    color: '#0066CC',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
