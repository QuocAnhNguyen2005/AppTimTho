import React, { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { getOnlineWorkers, WorkerInfo } from '../../services/workerService';
import { useAuth } from '../../context/AuthContext';

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
  const mapRef = useRef<MapView>(null);
  
  // Snap points for the main bottom sheet: 15% (just search bar), 50% (services), 90% (full list)
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);
  
  const [selectedWorker, setSelectedWorker] = useState<WorkerInfo | null>(null);
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const { user } = useAuth();

  // Local state for live worker simulation
  const [liveWorkers, setLiveWorkers] = useState([
    { id: 101, lat: 10.762, lng: 106.660, full_name: 'Trần Văn B', specialties: ['Sửa Điện'] },
    { id: 102, lat: 10.765, lng: 106.662, full_name: 'Lê Thị C', specialties: ['Sửa Nước'] },
    { id: 103, lat: 10.760, lng: 106.665, full_name: 'Nguyễn Văn A', specialties: ['Điện Lạnh'] },
  ]);

  useEffect(() => {
    fetchWorkers();
    
    // Simulate workers moving on the map
    const interval = setInterval(() => {
      setLiveWorkers(prev => prev.map(w => ({
        ...w,
        lat: w.lat + (Math.random() - 0.5) * 0.0005,
        lng: w.lng + (Math.random() - 0.5) * 0.0005
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    const result = await getOnlineWorkers();
    if (result.success && result.workers) {
      setWorkers(result.workers);
    }
    setLoadingWorkers(false);
  };

  const handleMarkerPress = (worker: any) => {
    setSelectedWorker(worker);
    
    // Animate map to worker
    mapRef.current?.animateCamera({
      center: { latitude: worker.lat, longitude: worker.lng },
      zoom: 16,
    }, { duration: 1000 });
    
    // Snap bottom sheet up to show worker details
    bottomSheetRef.current?.snapToIndex(1); // 50%
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

  const renderWorkerDetails = () => (
    <BottomSheetView style={styles.sheetContent}>
      <TouchableOpacity 
        style={styles.backBtn}
        onPress={() => setSelectedWorker(null)}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={{marginLeft: 8, fontSize: 16, fontWeight: 'bold'}}>Quay lại danh mục</Text>
      </TouchableOpacity>

      <Image source={{ uri: selectedWorker?.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.sheetAvatar} cachePolicy="memory-disk" />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
        <Text style={styles.sheetName}>{selectedWorker?.full_name}</Text>
        <TouchableOpacity onPress={handleShareWorker} style={styles.shareBtn}>
          <Ionicons name="share-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sheetSkill}>{selectedWorker?.specialties?.join(', ') || 'Đa năng'}</Text>
      
      <View style={styles.sheetStats}>
        <View style={styles.sheetStatItem}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.sheetStatText}>{selectedWorker?.average_rating || '4.9'} Đánh giá</Text>
        </View>
        <View style={styles.sheetStatItem}>
          <Ionicons name="briefcase" size={24} color="#0066CC" />
          <Text style={styles.sheetStatText}>{selectedWorker?.total_reviews || '120'} Việc</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
        <TouchableOpacity style={[styles.bookBtn, { flex: 1, backgroundColor: '#E8F1FA' }]} onPress={() => { router.push('/chat'); }}>
          <Text style={[styles.bookBtnText, { color: '#0066CC' }]}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bookBtn, { flex: 2 }]} onPress={() => { 
          router.push(`/(customer)/booking?workerId=${selectedWorker?.id}`); 
        }}>
          <Text style={styles.bookBtnText}>Đặt thợ ngay</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );

  const renderHomeContent = () => (
    <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn cần sửa gì hôm nay?"
          placeholderTextColor="#999"
        />
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

      {/* Featured Workers */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Thợ nổi bật gần bạn</Text>
        {loadingWorkers ? (
          <ActivityIndicator size="large" color="#0066CC" style={{ marginVertical: 20 }} />
        ) : workers.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginVertical: 20 }}>Hiện chưa có thợ nào online</Text>
        ) : (
          <BottomSheetScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
            {workers.map(worker => (
              <TouchableOpacity key={worker.id} style={styles.workerCard} onPress={() => {
                // Mock a lat/lng for these API workers just for demo
                handleMarkerPress({ ...worker, lat: 10.762, lng: 106.660 });
              }}>
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
          </BottomSheetScrollView>
        )}
      </View>
    </BottomSheetScrollView>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        
        {/* Full Screen Map */}
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 10.762622,
            longitude: 106.660172,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
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
              onPress={() => handleMarkerPress(w)}
            >
              <View style={styles.liveWorkerDot}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=' + w.id }} style={styles.mapAvatar} />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Floating Header Actions */}
        <SafeAreaView pointerEvents="box-none" style={styles.floatingHeader}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/(customer)/profile')}>
            <Ionicons name="person-circle" size={40} color="#0066CC" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Floating Find Location Button */}
        <TouchableOpacity 
          style={styles.myLocationBtn}
          onPress={() => {
            mapRef.current?.animateCamera({
              center: { latitude: 10.762622, longitude: 106.660172 },
              zoom: 15,
            });
          }}
        >
          <Ionicons name="locate" size={24} color="#0066CC" />
        </TouchableOpacity>

        <BottomSheet
          ref={bottomSheetRef}
          index={1} // Start at 50%
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 15 }}
        >
          {selectedWorker ? renderWorkerDetails() : renderHomeContent()}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  menuBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  myLocationBtn: {
    position: 'absolute',
    right: 20,
    bottom: '55%', // above the bottom sheet roughly
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  liveWorkerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  mapAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
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
    marginBottom: 16,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  bannerContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#0066CC',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
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
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 140,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  workerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  workerSkill: {
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
    marginLeft: 4,
  },
  sheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
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
