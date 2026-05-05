import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EkycScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: CCCD, 2: Face, 3: Certificate, 4: Waiting

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  if (step === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.waitingContainer}>
          <Ionicons name="time" size={80} color="#F39C12" />
          <Text style={styles.waitingTitle}>Hồ sơ đang chờ duyệt</Text>
          <Text style={styles.waitingDesc}>
            Admin đang kiểm tra thông tin của bạn. Hệ thống sẽ mở khóa nhận đơn sau khi duyệt thành công (thường mất 1-2 giờ làm việc).
          </Text>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => router.replace('/(worker)/home')}
          >
            <Text style={styles.btnText}>Trở về Trang chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác thực danh tính (eKYC)</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
        </View>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Chụp ảnh CCCD</Text>
            <Text style={styles.stepDesc}>Vui lòng chụp rõ nét 2 mặt CCCD/CMND của bạn.</Text>
            
            <TouchableOpacity style={styles.uploadBox}>
              <Ionicons name="camera" size={40} color="#999" />
              <Text style={styles.uploadText}>Chụp mặt trước</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadBox}>
              <Ionicons name="camera" size={40} color="#999" />
              <Text style={styles.uploadText}>Chụp mặt sau</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Xác thực khuôn mặt (Liveness Check)</Text>
            <Text style={styles.stepDesc}>Quay một video ngắn khuôn mặt của bạn theo hướng dẫn để đảm bảo bạn là người thật.</Text>
            
            <View style={styles.videoMockBox}>
              <Ionicons name="videocam" size={60} color="#E67E22" />
              <TouchableOpacity style={styles.recordBtn}>
                <Text style={styles.recordText}>Bắt đầu quay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Chứng chỉ hành nghề (Tuỳ chọn)</Text>
            <Text style={styles.stepDesc}>Tải lên bằng cấp, chứng chỉ nghề để tăng mức độ uy tín và nhận được nhiều đơn hơn.</Text>
            
            <TouchableOpacity style={styles.uploadBox}>
              <Ionicons name="document-attach" size={40} color="#999" />
              <Text style={styles.uploadText}>Tải file / Chụp ảnh chứng chỉ</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.btnText}>{step === 3 ? 'Gửi duyệt hồ sơ' : 'Tiếp tục'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EEE' },
  progressDotActive: { backgroundColor: '#E67E22' },
  progressLine: { width: 50, height: 2, backgroundColor: '#EEE' },
  progressLineActive: { backgroundColor: '#E67E22' },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  stepDesc: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 22 },
  uploadBox: { height: 160, backgroundColor: '#F9F9F9', borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadText: { marginTop: 12, color: '#666', fontWeight: '500' },
  videoMockBox: { height: 300, backgroundColor: '#F0F0F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  recordBtn: { marginTop: 24, backgroundColor: '#E67E22', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  recordText: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#EEE' },
  primaryBtn: { backgroundColor: '#E67E22', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  waitingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  waitingTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: '#333' },
  waitingDesc: { fontSize: 15, textAlign: 'center', color: '#666', lineHeight: 24, marginBottom: 40 }
});
