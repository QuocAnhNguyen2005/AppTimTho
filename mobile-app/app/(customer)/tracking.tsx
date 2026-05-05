import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getJobById } from '../../services/jobService';

export default function TrackingScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const [status, setStatus] = useState<'finding' | 'accepted' | 'arriving' | 'working' | 'reviewing_proof' | 'completed'>('finding');
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [workerInfo, setWorkerInfo] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number>(150000);

  useEffect(() => {
    if (!jobId) return;

    const pollJob = async () => {
      const result = await getJobById(parseInt(jobId as string));
      if (result.success && result.job) {
        const job = result.job;
        if (job.worker_name) {
          setWorkerInfo({
            name: job.worker_name,
            phone: job.worker_phone,
          });
        }
        
        if (job.total_price) {
          setTotalPrice(job.total_price);
        }

        // Map backend status to mobile status
        if (job.status === 'PENDING') {
          setStatus('finding');
        } else if (job.status === 'ACCEPTED') {
          // Simplification: just show accepted. In a full app, we'd add 'ARRIVING', 'WORKING' to DB
          setStatus(prev => (prev === 'finding' ? 'accepted' : prev));
        } else if (job.status === 'COMPLETED' && status !== 'completed') {
          setStatus('reviewing_proof');
        }
      }
    };

    // Initial poll
    pollJob();

    // Setup polling every 3 seconds
    const intervalId = setInterval(pollJob, 3000);
    return () => clearInterval(intervalId);
  }, [jobId, status]);

  const renderContent = () => {
    if (status === 'finding') {
      return (
        <View style={styles.findingContainer}>
          <View style={styles.radarMock}>
            <Ionicons name="scan" size={100} color="#0066CC" />
          </View>
          <Text style={styles.findingText}>Đang quét tìm thợ xung quanh...</Text>
          <Text style={styles.findingSubtext}>Vui lòng giữ ứng dụng mở</Text>
          
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Hủy Đơn</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {/* Map Mock */}
        <View style={styles.mapArea}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={64} color="#999" />
            <Text style={{ marginTop: 8, color: '#666' }}>
              {status === 'arriving' ? 'Bản đồ Live: Thợ đang di chuyển...' : 'Vị trí hiện tại'}
            </Text>
          </View>
        </View>

        {/* Worker Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerHeader}>
            <View style={styles.avatarMock}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>Nguyễn Văn A</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F39C12" />
                <Text style={styles.ratingText}>4.9 (120 chuyến)</Text>
              </View>
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.plateNumber}>59-X1 123.45</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Trạng thái:</Text>
            <Text style={styles.statusValue}>
              {status === 'accepted' ? 'Đã nhận đơn' :
               status === 'arriving' ? 'Đang tới (Dự kiến 5 phút)' :
               status === 'working' ? 'Đang sửa chữa' : 
               status === 'reviewing_proof' ? 'Chờ xác nhận nghiệm thu' : 'Hoàn thành'}
            </Text>
          </View>

          {(status === 'accepted' || status === 'arriving') && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="call" size={20} color="#0066CC" />
                <Text style={styles.actionBtnText}>Gọi điện</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble" size={20} color="#0066CC" />
                <Text style={styles.actionBtnText}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'reviewing_proof' && (
            <View style={styles.proofContainer}>
              <Text style={styles.proofTitle}>Thợ đã gửi ảnh nghiệm thu</Text>
              <View style={styles.proofImageMock}>
                <Ionicons name="image-outline" size={48} color="#999" />
                <Text style={{color: '#666', marginTop: 8}}>Ảnh điều hòa đã sửa xong</Text>
              </View>
              <TouchableOpacity 
                style={styles.confirmProofBtn}
                onPress={() => {
                  setStatus('completed');
                  setShowReview(true);
                }}
              >
                <Text style={styles.confirmProofBtnText}>Xác nhận thanh toán & Đánh giá</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Theo dõi tiến độ</Text>
      </View>

      {renderContent()}

      {/* Review Modal */}
      <Modal visible={showReview} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.modalTitle}>Công việc hoàn tất!</Text>
            <Text style={styles.modalText}>
              Vui lòng thanh toán trực tiếp <Text style={{fontWeight:'bold'}}>150.000đ</Text> cho thợ bằng Tiền mặt hoặc Chuyển khoản cá nhân.
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons 
                    name={rating >= star ? "star" : "star-outline"} 
                    size={40} 
                    color="#F39C12" 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.submitBtn}
              onPress={() => {
                setShowReview(false);
                router.replace('/(customer)/home');
              }}
            >
              <Text style={styles.submitBtnText}>Gửi Đánh Giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  findingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radarMock: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  findingText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  findingSubtext: { fontSize: 14, color: '#666', marginTop: 8 },
  mapArea: { flex: 1, backgroundColor: '#EAEAEA' },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  workerCard: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: {width: 0, height: -2}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  workerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarMock: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
  workerInfo: { flex: 1, marginLeft: 12 },
  workerName: { fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, color: '#666', marginLeft: 4 },
  vehicleInfo: { backgroundColor: '#EEE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  plateNumber: { fontSize: 12, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  statusLabel: { fontSize: 14, color: '#666' },
  statusValue: { fontSize: 14, fontWeight: 'bold', color: '#0066CC' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F8FF', paddingVertical: 12, borderRadius: 12 },
  actionBtnText: { marginLeft: 8, color: '#0066CC', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  modalText: { fontSize: 14, textAlign: 'center', color: '#444', lineHeight: 22, marginBottom: 20 },
  starsContainer: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  submitBtn: { width: '100%', backgroundColor: '#0066CC', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { marginTop: 40, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
  cancelBtnText: { color: '#666', fontSize: 16, fontWeight: '500' },
  proofContainer: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 16 },
  proofTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  proofImageMock: { height: 150, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  confirmProofBtn: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmProofBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
