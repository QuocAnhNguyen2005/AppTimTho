import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function CustomerHome() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);

  const services = [
    { id: 1, name: 'Sửa Điện', icon: 'flash', color: '#FF9800' },
    { id: 2, name: 'Sửa Nước', icon: 'water', color: '#03A9F4' },
    { id: 3, name: 'Điện Lạnh', icon: 'snow', color: '#00BCD4' },
    { id: 4, name: 'Thông Tắc', icon: 'construct', color: '#795548' },
    { id: 5, name: 'Thợ Xây', icon: 'hammer', color: '#607D8B' },
    { id: 6, name: 'Vệ Sinh', icon: 'leaf', color: '#4CAF50' },
  ];

  const workers = [
    { id: 1, name: 'Nguyễn Văn A', skill: 'Sửa Điện Lạnh', rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 2, name: 'Trần Thị B', skill: 'Vệ Sinh Nhà', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 3, name: 'Lê Văn C', skill: 'Sửa Nước', rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  ];

  const handleOpenWorker = (worker: any) => {
    setSelectedWorker(worker);
    bottomSheetRef.current?.expand();
  };

  const handleShareWorker = async () => {
    if (!selectedWorker) return;
    const url = Linking.createURL(`/(customer)/profile?workerId=${selectedWorker.id}`);
    try {
      await Share.share({
        message: `Tôi muốn giới thiệu thợ ${selectedWorker.name} cực kỳ uy tín trên App Tìm Thợ. Đặt lịch ngay: ${url}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.userName}>Khách Hàng</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(customer)/profile')}>
              <Ionicons name="person-circle" size={48} color="#0066CC" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Bạn cần sửa gì hôm nay? (VD: Sửa tủ lạnh)"
              placeholderTextColor="#999"
            />
          </View>

          {/* Promo Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Giảm 20%</Text>
              <Text style={styles.bannerSubtitle}>cho lần đặt thợ đầu tiên!</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Dùng ngay</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="gift" size={80} color="#fff" style={styles.bannerIcon} />
          </View>

          {/* Services Grid */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Dịch vụ phổ biến</Text>
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceItem}
                  onPress={() => router.push('/(customer)/booking')}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: service.color + '20' }]}>
                    <Ionicons name={service.icon as any} size={32} color={service.color} />
                  </View>
                  <Text style={styles.serviceText}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured Workers */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Thợ nổi bật gần bạn</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
              {workers.map(worker => (
                <TouchableOpacity key={worker.id} style={styles.workerCard} onPress={() => handleOpenWorker(worker)}>
                  <Image source={{ uri: worker.avatar }} style={styles.workerAvatar} cachePolicy="memory-disk" />
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerSkill}>{worker.skill}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{worker.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{ width: 48 }} />
            </ScrollView>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Worker Details Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ borderRadius: 24 }}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedWorker && (
              <>
                <Image source={{ uri: selectedWorker.avatar }} style={styles.sheetAvatar} cachePolicy="memory-disk" />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
                  <Text style={styles.sheetName}>{selectedWorker.name}</Text>
                  <TouchableOpacity onPress={handleShareWorker} style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={24} color="#0066CC" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sheetSkill}>{selectedWorker.skill}</Text>
                
                <View style={styles.sheetStats}>
                  <View style={styles.sheetStatItem}>
                    <Ionicons name="star" size={24} color="#FFD700" />
                    <Text style={styles.sheetStatText}>{selectedWorker.rating} Đánh giá</Text>
                  </View>
                  <View style={styles.sheetStatItem}>
                    <Ionicons name="briefcase" size={24} color="#0066CC" />
                    <Text style={styles.sheetStatText}>120+ Việc</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
                  <TouchableOpacity style={[styles.bookBtn, { flex: 1, backgroundColor: '#E8F1FA' }]} onPress={() => { bottomSheetRef.current?.close(); router.push('/chat'); }}>
                    <Text style={[styles.bookBtnText, { color: '#0066CC' }]}>Nhắn tin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bookBtn, { flex: 2 }]} onPress={() => { bottomSheetRef.current?.close(); router.push('/(customer)/booking'); }}>
                    <Text style={styles.bookBtnText}>Đặt thợ ngay</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  bannerContainer: {
    margin: 24,
    backgroundColor: '#0066CC',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  bannerIcon: {
    opacity: 0.2,
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  workerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  workerSkill: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B8860B',
    marginLeft: 4,
  },
  sheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  sheetAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#0066CC',
  },
  sheetName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  shareBtn: {
    padding: 8,
    backgroundColor: '#E8F1FA',
    borderRadius: 20,
  },
  sheetSkill: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  sheetStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sheetStatItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    width: '45%',
  },
  sheetStatText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  bookBtn: {
    backgroundColor: '#0066CC',
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
