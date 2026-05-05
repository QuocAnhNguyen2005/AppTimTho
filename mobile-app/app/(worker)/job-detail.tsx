import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function JobDetailScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'moving' | 'arrived' | 'checking' | 'fixing' | 'done'>('moving');
  const [showCamera, setShowCamera] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  const getStatusText = () => {
    switch (status) {
      case 'moving': return 'Đang di chuyển';
      case 'arrived': return 'Đã đến nơi';
      case 'checking': return 'Đang kiểm tra lỗi';
      case 'fixing': return 'Đang tiến hành sửa';
      case 'done': return 'Hoàn thành công việc';
    }
  };

  const handleNextStatus = () => {
    if (status === 'moving') setStatus('arrived');
    else if (status === 'arrived') setStatus('checking');
    else if (status === 'checking') setStatus('fixing');
    else if (status === 'fixing') setShowCamera(true);
    else if (status === 'done') router.replace('/(worker)/home');
  };

  const handleTakePhoto = () => {
    setShowCamera(false);
    setPhotoTaken(true);
    setStatus('done');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chi tiết công việc</Text>
      </View>

      <View style={styles.content}>
        {/* Customer Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatarMock}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.customerName}>Khách Hàng A</Text>
              <Text style={styles.customerPhone}>0901234567</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Ionicons name="location" size={20} color="#E74C3C" />
            <Text style={styles.addressText}>123 Nguyễn Văn Linh, Quận 7</Text>
          </View>
          
          {status === 'moving' && (
            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="navigate" size={16} color="#0066CC" />
              <Text style={styles.navBtnText}>Chỉ đường (Mở Google Maps)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Job Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả vấn đề</Text>
          <Text style={styles.descText}>Tủ lạnh không đông đá, ngăn dưới vẫn mát bình thường. Kêu tiếng è è.</Text>
          
          <View style={styles.mediaBox}>
            <Ionicons name="image" size={40} color="#999" />
            <Text style={{ marginTop: 8, color: '#666' }}>Ảnh khách đính kèm</Text>
          </View>
        </View>

        {/* Proof of work */}
        {photoTaken && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Bằng chứng hoàn thành</Text>
            <View style={styles.proofImageMock}>
              <Ionicons name="checkmark-circle" size={50} color="#27AE60" />
              <View style={styles.watermarkMock}>
                <Text style={styles.watermarkText}>14:30 05/05/2026</Text>
                <Text style={styles.watermarkText}>Lat: 10.762, Lng: 106.660</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
          <Text style={styles.statusValue}>{getStatusText()}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.actionBtn, status === 'done' && styles.actionBtnDone]}
          onPress={handleNextStatus}
        >
          <Text style={styles.actionBtnText}>
            {status === 'moving' ? 'Đã đến nơi' :
             status === 'arrived' ? 'Bắt đầu kiểm tra' :
             status === 'checking' ? 'Bắt đầu sửa chữa' :
             status === 'fixing' ? 'Hoàn thành (Chụp ảnh)' : 'Đóng & Trở về'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal Mock */}
      <Modal visible={showCamera} transparent animationType="slide">
        <View style={styles.cameraContainer}>
          <View style={styles.cameraView}>
            <Text style={styles.cameraText}>CAMERA PREVIEW</Text>
            <View style={styles.cameraWatermark}>
              <Text style={styles.cameraWatermarkText}>GPS: 10.762, 106.660</Text>
              <Text style={styles.cameraWatermarkText}>14:30 05/05/2026</Text>
            </View>
          </View>
          
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarMock: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  customerName: { fontSize: 16, fontWeight: 'bold' },
  customerPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  addressText: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  navBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F1FA', padding: 12, borderRadius: 8, marginTop: 16 },
  navBtnText: { color: '#0066CC', fontWeight: 'bold', marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  descText: { fontSize: 14, color: '#444', lineHeight: 22 },
  mediaBox: { height: 120, backgroundColor: '#F9F9F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  bottomBar: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  statusIndicator: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statusLabel: { fontSize: 14, color: '#666' },
  statusValue: { fontSize: 14, fontWeight: 'bold', color: '#E67E22' },
  actionBtn: { backgroundColor: '#E67E22', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnDone: { backgroundColor: '#27AE60' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraText: { color: '#666', fontSize: 24, fontWeight: 'bold' },
  cameraWatermark: { position: 'absolute', bottom: 20, right: 20, alignItems: 'flex-end' },
  cameraWatermarkText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textShadowColor: '#000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  cameraControls: { height: 150, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  proofImageMock: { height: 200, backgroundColor: '#E8F5E9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  watermarkMock: { position: 'absolute', bottom: 10, right: 10, alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 4 },
  watermarkText: { color: '#fff', fontSize: 10 }
});
