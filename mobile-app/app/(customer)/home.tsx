import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { UrlTile, Marker } from 'react-native-maps';

const services = [
  { id: 1, name: 'Sửa Điện', icon: 'flash', color: '#FF9800' },
  { id: 2, name: 'Sửa Nước', icon: 'water', color: '#03A9F4' },
  { id: 3, name: 'Điện Lạnh', icon: 'snow', color: '#00BCD4' },
  { id: 4, name: 'Thông Tắc', icon: 'construct', color: '#795548' },
  { id: 5, name: 'Thợ Xây', icon: 'hammer', color: '#607D8B' },
  { id: 6, name: 'Vệ Sinh', icon: 'leaf', color: '#4CAF50' },
];

export default function CustomerHome() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const [selectedWorker, setSelectedWorker] = useState<WorkerInfo | null>(null);
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const { user } = useAuth();

  // Local state for live worker simulation
  const [liveWorkers, setLiveWorkers] = useState([
    { id: 1, lat: 10.762, lng: 106.660 },
    { id: 2, lat: 10.765, lng: 106.662 },
    { id: 3, lat: 10.760, lng: 106.665 },
  ]);

  useEffect(() => {
    fetchWorkers();
    
    // Simulate workers moving on the map
    const interval = setInterval(() => {
      setLiveWorkers(prev => prev.map(w => ({
        ...w,
        lat: w.lat + (Math.random() - 0.5) * 0.001,
        lng: w.lng + (Math.random() - 0.5) * 0.001
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenWorker = (worker: any) => {
    setSelectedWorker(worker);
    bottomSheetRef.current?.expand();
  };

  const handleShareWorker = async () => {
    if (!selectedWorker) return;
    const url = Linking.createURL(`/(customer)/profile?workerId=${selectedWorker.id}`);
    try {
      await Share.share({
        message: `Tôi muốn giới thiệu thợ ${selectedWorker.full_name} cực kỳ uy tín trên App Tìm Thợ. Đặt lịch ngay: ${url}`,
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
              <Text style={styles.userName}>{user?.full_name || 'Khách Hàng'}</Text>
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

          {/* Map Mini Heatmap */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Thợ đang hoạt động gần bạn</Text>
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 10.762622,
                  longitude: 106.660172,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
              >
                <UrlTile
                  urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                {liveWorkers.map(w => (
                  <Marker
                    key={w.id}
                    coordinate={{ latitude: w.lat, longitude: w.lng }}
                  >
                    <View style={styles.liveWorkerDot}>
                      <View style={styles.liveWorkerDotInner} />
                    </View>
                  </Marker>
                ))}
              </MapView>
              <View style={styles.mapOverlayText}>
                <Ionicons name="flash" size={16} color="#FF9800" />
                <Text style={styles.mapOverlayLabel}>Hàng chục thợ sẵn sàng</Text>
              </View>
            </View>
          </View>

          {/* Featured Workers */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Thợ nổi bật gần bạn</Text>
            {loadingWorkers ? (
              <ActivityIndicator size="large" color="#0066CC" style={{ marginVertical: 20 }} />
            ) : workers.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#999', marginVertical: 20 }}>Hiện chưa có thợ nào online</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
                {workers.map(worker => (
                  <TouchableOpacity key={worker.id} style={styles.workerCard} onPress={() => handleOpenWorker(worker)}>
                    <Image source={{ uri: worker.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.workerAvatar} cachePolicy="memory-disk" />
                    <Text style={styles.workerName}>{worker.full_name}</Text>
                    <Text style={styles.workerSkill}>{worker.specialties?.[0] || 'Đa năng'}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{worker.average_rating}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <View style={{ width: 48 }} />
              </ScrollView>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

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
                <Image source={{ uri: selectedWorker.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.sheetAvatar} cachePolicy="memory-disk" />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
                  <Text style={styles.sheetName}>{selectedWorker.full_name}</Text>
                  <TouchableOpacity onPress={handleShareWorker} style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={24} color="#0066CC" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sheetSkill}>{selectedWorker.specialties?.join(', ') || 'Đa năng'}</Text>
                
                <View style={styles.sheetStats}>
                  <View style={styles.sheetStatItem}>
                    <Ionicons name="star" size={24} color="#FFD700" />
                    <Text style={styles.sheetStatText}>{selectedWorker.average_rating} Đánh giá</Text>
                  </View>
                  <View style={styles.sheetStatItem}>
                    <Ionicons name="briefcase" size={24} color="#0066CC" />
                    <Text style={styles.sheetStatText}>{selectedWorker.total_reviews} Việc</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
                  <TouchableOpacity style={[styles.bookBtn, { flex: 1, backgroundColor: '#E8F1FA' }]} onPress={() => { bottomSheetRef.current?.close(); router.push('/chat'); }}>
                    <Text style={[styles.bookBtnText, { color: '#0066CC' }]}>Nhắn tin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bookBtn, { flex: 2 }]} onPress={() => { 
                    bottomSheetRef.current?.close(); 
                    router.push(`/(customer)/booking?workerId=${selectedWorker.id}`); 
                  }}>
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
  lastBookedText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  rebookBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rebookBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
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
  mapWrapper: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  liveWorkerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 102, 204, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveWorkerDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066CC',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapOverlayText: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapOverlayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
});
