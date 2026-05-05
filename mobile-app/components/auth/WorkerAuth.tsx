import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { loginAPI, registerWorkerAPI } from '../../services/authService';

const SPECIALTIES = [
  { id: 'dien', label: 'Sửa Điện' },
  { id: 'nuoc', label: 'Sửa Nước' },
  { id: 'dienlanh', label: 'Điện Lạnh' },
  { id: 'thongtac', label: 'Thông Tắc' },
];

export default function WorkerAuth({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string[]>([]);
  const [kycUploaded, setKycUploaded] = useState(false);

  const totalSteps = 4;

  const handleLogin = async () => {
    if (!phone || !password) {
      return Alert.alert('Thiếu thông tin', 'Vui lòng nhập Số điện thoại và Mật khẩu');
    }
    setIsLoading(true);
    const result = await loginAPI(phone, password);
    setIsLoading(false);

    if (!result.success) {
      return Alert.alert('Đăng nhập thất bại', result.error);
    }

    if (result.role !== 'worker') {
      return Alert.alert(
        'Sai vai trò',
        result.role === 'customer'
          ? 'Tài khoản này là Khách hàng. Vui lòng đăng nhập ở phần "Tôi muốn Tìm Thợ".'
          : 'Tài khoản Admin không thể đăng nhập tại đây.'
      );
    }

    login('worker', result.user);
  };

  const handleSocialLogin = () => {
    Alert.alert('Sắp ra mắt', 'Tính năng đăng nhập nhanh đang được phát triển.');
  };

  const handleNextStep = async () => {
    if (step === 1 && (!phone || !password)) return Alert.alert('Lỗi', 'Vui lòng nhập Số điện thoại và Mật khẩu');
    if (step === 1 && password.length < 6) return Alert.alert('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự');
    if (step === 2 && !fullName) return Alert.alert('Lỗi', 'Vui lòng nhập Họ và tên');
    if (step === 3 && selectedSpecialty.length === 0) return Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một chuyên môn');

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await handleRegisterComplete();
    }
  };

  const handleRegisterComplete = async () => {
    if (!kycUploaded) return Alert.alert('Thiếu tài liệu', 'Vui lòng tải lên CCCD & Bằng cấp');

    setIsLoading(true);
    const result = await registerWorkerAPI(phone, password, fullName, selectedSpecialty);
    setIsLoading(false);

    if (!result.success) {
      return Alert.alert('Đăng ký thất bại', result.error);
    }

    Alert.alert(
      '🎉 Đăng ký thành công!',
      'Hồ sơ đang chờ Admin duyệt. Bạn sẽ nhận thông báo sau khi được xác nhận.\n\nVui lòng đăng nhập để tiếp tục.',
      [{ text: 'Đăng nhập', onPress: () => { setMode('login'); setStep(1); setPassword(''); } }]
    );
  };

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialty(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(step / totalSteps) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Bước {step}/{totalSteps}</Text>
    </View>
  );

  const renderLogin = () => (
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
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>

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

      <View style={styles.switchModeContainer}>
        <Text style={styles.switchModeText}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => { setMode('register'); setStep(1); }}>
          <Text style={styles.switchModeAction}> Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRegisterStep = () => (
    <View style={styles.form}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Tạo tài khoản</Text>
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
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Thông tin cơ bản</Text>
          <Text style={styles.stepDesc}>Nhập tên thật để khách hàng tin tưởng.</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Họ và Tên"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Chọn chuyên môn</Text>
          <Text style={styles.stepDesc}>Có thể chọn nhiều nghề.</Text>
          <View style={styles.tagsContainer}>
            {SPECIALTIES.map((item) => {
              const isSelected = selectedSpecialty.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                  onPress={() => toggleSpecialty(item.id)}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{item.label}</Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Xác thực danh tính (eKYC)</Text>
          <Text style={styles.stepDesc}>Tải lên CCCD & Bằng cấp để được Admin duyệt.</Text>
          <TouchableOpacity
            style={[styles.uploadBox, kycUploaded && styles.uploadBoxSuccess]}
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => { setIsLoading(false); setKycUploaded(true); }, 800);
            }}
          >
            <Ionicons
              name={kycUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
              size={48}
              color={kycUploaded ? '#4CAF50' : '#E67E22'}
            />
            <Text style={[styles.uploadText, kycUploaded && { color: '#4CAF50' }]}>
              {kycUploaded ? 'Đã tải lên thành công' : 'Chạm để tải lên CCCD & Bằng cấp'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleNextStep} disabled={isLoading}>
        {isLoading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>{step === totalSteps ? 'Hoàn tất đăng ký' : 'Tiếp tục'}</Text>
        }
      </TouchableOpacity>

      {step === 1 && (
        <View style={styles.switchModeContainer}>
          <Text style={styles.switchModeText}>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => setMode('login')}>
            <Text style={styles.switchModeAction}> Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (mode === 'login') onBack();
          else if (step === 1) setMode('login');
          else setStep(step - 1);
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập Thợ' : 'Đăng ký Thợ'}</Text>
      {mode === 'register' && renderProgressBar()}

      <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
        {mode === 'login' ? renderLogin() : renderRegisterStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  progressContainer: { marginBottom: 24 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  progressText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'right' },
  formScrollView: { flex: 1 },
  form: {
    backgroundColor: '#fff', padding: 24, borderRadius: 20, marginBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  stepContainer: { marginBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  stepDesc: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, paddingHorizontal: 12, height: 56, backgroundColor: '#F8F9FA', marginBottom: 16,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotPasswordText: { color: '#E67E22', fontSize: 14, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#E67E22', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 12, color: '#666', fontSize: 14 },
  socialButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, height: 56, backgroundColor: '#fff',
  },
  socialButtonText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 12 },
  zaloIconMock: { backgroundColor: '#0068FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  zaloIconText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  switchModeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchModeText: { color: '#666', fontSize: 15 },
  switchModeAction: { color: '#E67E22', fontSize: 15, fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tag: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F8F9FA',
  },
  tagSelected: { backgroundColor: '#E67E22', borderColor: '#E67E22' },
  tagText: { fontSize: 14, color: '#666', fontWeight: '600' },
  tagTextSelected: { color: '#fff' },
  uploadBox: {
    borderWidth: 2, borderColor: '#E67E22', borderStyle: 'dashed', borderRadius: 12,
    padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(230, 126, 34, 0.05)',
  },
  uploadBoxSuccess: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.05)' },
  uploadText: { marginTop: 12, color: '#E67E22', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
