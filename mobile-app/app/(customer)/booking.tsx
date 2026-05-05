import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [timeMode, setTimeMode] = useState<'now' | 'schedule'>('now');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt thợ sửa chữa</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Step 1: Location Map Mock */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>1. Vị trí của bạn</Text>
          <View style={styles.mapContainer}>
            <View style={styles.mapMock}>
              <Ionicons name="map-outline" size={48} color="#999" />
              <Text style={styles.mapText}>Bản đồ Google Maps</Text>
              <View style={styles.pin}>
                <Ionicons name="location" size={32} color="#E74C3C" />
              </View>
            </View>
            <View style={styles.addressBox}>
              <Ionicons name="location" size={20} color="#0066CC" />
              <Text style={styles.addressText} numberOfLines={1}>123 Đường Nguyễn Văn Linh, Quận 7</Text>
            </View>
          </View>
        </View>

        {/* Step 2: Time Selection */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>2. Thời gian sửa chữa</Text>
          <View style={styles.timeButtons}>
            <TouchableOpacity 
              style={[styles.timeBtn, timeMode === 'now' && styles.timeBtnActive]}
              onPress={() => setTimeMode('now')}
            >
              <Text style={timeMode === 'now' ? styles.timeEmojiActive : styles.timeEmoji}>⚡</Text>
              <Text style={[styles.timeBtnText, timeMode === 'now' && styles.timeBtnTextActive]}>Đến ngay lập tức</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeBtn, timeMode === 'schedule' && styles.timeBtnActive]}
              onPress={() => setTimeMode('schedule')}
            >
              <Text style={timeMode === 'schedule' ? styles.timeEmojiActive : styles.timeEmoji}>📅</Text>
              <Text style={[styles.timeBtnText, timeMode === 'schedule' && styles.timeBtnTextActive]}>Chọn giờ hẹn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 3: Issue Description */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>3. Mô tả vấn đề</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Mô tả chi tiết tình trạng lỗi để thợ chuẩn bị dụng cụ..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaBtn}>
              <Ionicons name="camera-outline" size={24} color="#0066CC" />
              <Text style={styles.mediaBtnText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaBtn}>
              <Ionicons name="mic-outline" size={24} color="#0066CC" />
              <Text style={styles.mediaBtnText}>Ghi âm</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 4: Confirmation */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>4. Chi phí dự kiến</Text>
          <View style={styles.priceBox}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Phí kiểm tra ban đầu:</Text>
              <Text style={styles.priceValue}>50.000 đ</Text>
            </View>
            <Text style={styles.priceNote}>
              * Giá sửa chữa thực tế sẽ được thợ báo sau khi kiểm tra trực tiếp.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push('/(customer)/tracking')}
        >
          <Text style={styles.bookButtonText}>Tìm Thợ Ngay</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapMock: {
    height: 150,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: 8,
    color: '#999',
    fontWeight: '500',
  },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -32,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  addressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  timeBtnActive: {
    borderColor: '#0066CC',
    backgroundColor: '#F0F7FF',
  },
  timeEmoji: {
    fontSize: 24,
    marginBottom: 8,
    opacity: 0.5,
  },
  timeEmojiActive: {
    fontSize: 24,
    marginBottom: 8,
    opacity: 1,
  },
  timeBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeBtnTextActive: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  mediaButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  mediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mediaBtnText: {
    marginLeft: 6,
    color: '#0066CC',
    fontWeight: '600',
    fontSize: 14,
  },
  priceBox: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 12,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#555',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  priceNote: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
