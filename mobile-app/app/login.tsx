import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = () => {
    if (phone.length > 8) {
      setIsOtpSent(true);
    } else {
      alert('Vui lòng nhập số điện thoại hợp lệ');
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      router.push('/role-selection');
    } else {
      alert('Mã OTP không đúng. (Nhập 123456)');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Đăng nhập bằng FaceID / Vân tay',
          fallbackLabel: 'Sử dụng mật khẩu',
        });

        if (result.success) {
          router.push('/role-selection');
        }
      } else {
        alert('Thiết bị không hỗ trợ hoặc chưa cài đặt sinh trắc học.');
      }
    } catch (error) {
      console.log('Biometric auth error', error);
      alert('Lỗi xác thực sinh trắc học');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>Tìm Thợ Nhanh</Text>
          <Text style={styles.subtitle}>Kết nối thợ lành nghề nhanh chóng</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại của bạn"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!isOtpSent}
            />
          </View>

          {isOtpSent && (
            <>
              <Text style={styles.label}>Mã OTP (123456)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mã OTP 6 số"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
              </View>
            </>
          )}

          {!isOtpSent ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Gửi mã OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>Xác nhận & Đăng nhập</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
            <Ionicons name="finger-print-outline" size={24} color="#0066CC" />
            <Text style={styles.biometricText}>Đăng nhập bằng FaceID / Vân tay</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
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
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
  },
  biometricText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
