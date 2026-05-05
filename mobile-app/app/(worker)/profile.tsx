import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function WorkerProfileScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('Thợ Nguyễn Văn A');
  const [phone, setPhone] = useState('0901234567');
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ thợ</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#ccc" />
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Text style={styles.editAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <Text style={styles.label}>Số điện thoại liên hệ</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Nhận thông báo (Push)</Text>
              <Text style={styles.switchSubLabel}>Báo có đơn mới quanh bạn</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleBtn, pushEnabled ? styles.toggleOn : styles.toggleOff]}
              onPress={() => setPushEnabled(!pushEnabled)}
            >
              <View style={[styles.toggleCircle, pushEnabled ? styles.circleOn : styles.circleOff]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.ekycStatus}>
          <View style={styles.ekycHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#27AE60" />
            <Text style={styles.ekycTitle}>Trạng thái xác thực (eKYC)</Text>
          </View>
          <Text style={styles.ekycText}>Hồ sơ của bạn đã được Admin duyệt. Bạn có thể nhận đơn bình thường.</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 16, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  editAvatarText: { color: '#E67E22', fontWeight: '600' },
  formSection: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 12, height: 50, marginBottom: 20 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  switchSubLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  toggleBtn: { width: 50, height: 30, borderRadius: 15, justifyContent: 'center', padding: 2 },
  toggleOn: { backgroundColor: '#4CAF50' },
  toggleOff: { backgroundColor: '#ccc' },
  toggleCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' },
  circleOn: { alignSelf: 'flex-end' },
  circleOff: { alignSelf: 'flex-start' },
  ekycStatus: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: '#C8E6C9' },
  ekycHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ekycTitle: { fontSize: 16, fontWeight: 'bold', color: '#27AE60', marginLeft: 8 },
  ekycText: { fontSize: 14, color: '#2E7D32', lineHeight: 20 },
  saveBtn: { backgroundColor: '#E67E22', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, backgroundColor: '#FFEBEB' },
  logoutText: { color: '#E74C3C', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }
});
