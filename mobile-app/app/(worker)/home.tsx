import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, withRepeat, withTiming, Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useAuth } from '../../context/AuthContext';
import { getWorkerJobs, updateJobStatus } from '../../services/jobService';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    console.log('Throttled background location update:', locations[0]);
  }
});

const { width } = Dimensions.get('window');

export default function WorkerHome() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingJob, setIncomingJob] = useState<any>(null);
  const { user } = useAuth();

  const translateX = useSharedValue(0);
  const swipeLimit = width - 48 - 60; // card width minus padding and button size

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }
    })();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isOnline && user?.id) {
      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 20,
        deferredUpdatesInterval: 10000,
        foregroundService: {
          notificationTitle: "Đang nhận đơn",
          notificationBody: "App Tìm Thợ đang theo dõi vị trí để gửi đơn cho bạn.",
          notificationColor: "#E67E22",
        },
      }).catch(console.log);

      intervalId = setInterval(async () => {
        const result = await getWorkerJobs(user.id);
        if (result.success && result.jobs) {
          const pendingJob = result.jobs.find(j => j.status === 'PENDING');
          if (pendingJob) {
            setIncomingJob(pendingJob);
            translateX.value = 0;
            
            // Zoom to customer location when job arrives
            if (mapRef.current) {
               mapRef.current.animateCamera({
                 center: { latitude: 10.762622, longitude: 106.660172 }, // Mock customer loc
                 zoom: 16
               });
            }
          } else {
            setIncomingJob(null);
          }
        }
      }, 3000);
    } else {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(console.log);
      setIncomingJob(null);
    }

    if (isOnline) {
      pulseScale.value = withRepeat(withTiming(2, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
      pulseOpacity.value = withRepeat(withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
    } else {
      pulseScale.value = 1;
      pulseOpacity.value = 0.5;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, user?.id]);

  const handleAcceptJob = async () => {
    if (!incomingJob) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateJobStatus(incomingJob.id, 'ACCEPTED');
    setIncomingJob(null);
    router.push(`/(worker)/job-detail?jobId=${incomingJob.id}`);
  };

  const handleRejectJob = async () => {
    if (!incomingJob) return;
    await updateJobStatus(incomingJob.id, 'REJECTED');
    setIncomingJob(null);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX >= 0 && e.translationX <= swipeLimit) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (translateX.value > swipeLimit * 0.7) {
        translateX.value = withSpring(swipeLimit);
        runOnJS(handleAcceptJob)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedSwipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedPulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

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
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          
          {/* Heatmap Fire Icons */}
          {isOnline && (
            <>
              <Marker coordinate={{ latitude: 10.760, longitude: 106.665 }}>
                <View style={styles.fireIconContainer}>
                  <Ionicons name="flame" size={32} color="#E74C3C" />
                </View>
              </Marker>
              <Marker coordinate={{ latitude: 10.770, longitude: 106.670 }}>
                <View style={[styles.fireIconContainer, { transform: [{scale: 0.8}] }]}>
                  <Ionicons name="flame" size={32} color="#E67E22" />
                </View>
              </Marker>
              
              {/* Worker Pulse */}
              <Marker coordinate={{ latitude: 10.762622, longitude: 106.660172 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Animated.View style={[styles.radarCircle, { width: 60, height: 60, borderRadius: 30, position: 'absolute' }, animatedPulseStyle1]} />
                  <Ionicons name="person-circle" size={36} color="#0066CC" />
                </View>
              </Marker>
            </>
          )}
        </MapView>

        {/* Offline Overlay */}
        {!isOnline && (
          <View style={styles.offlineOverlay}>
            <View style={styles.offlineBox}>
              <Ionicons name="moon" size={48} color="#999" />
              <Text style={styles.offlineText}>Bạn đang Offline</Text>
            </View>
          </View>
        )}

        {/* Floating Actions */}
        <SafeAreaView style={styles.floatingTop}>
          <View style={styles.topRow}>
            {/* Minimal Wallet Info */}
            <View style={styles.walletBox}>
              <Ionicons name="wallet" size={16} color="#0066CC" />
              <Text style={styles.walletText}>500.000đ</Text>
            </View>
            
            {/* FAB Online Toggle */}
            <TouchableOpacity 
              style={[styles.fabToggle, isOnline ? styles.fabOnline : styles.fabOffline]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsOnline(!isOnline);
              }}
            >
              <Ionicons name="power" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Recenter Button */}
        <TouchableOpacity 
          style={styles.recenterBtn}
          onPress={() => {
            mapRef.current?.animateCamera({
              center: { latitude: 10.762622, longitude: 106.660172 },
              zoom: 15,
            });
          }}
        >
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>

        {/* New Job Alert Popup */}
        {incomingJob && (
          <Animated.View 
            entering={SlideInDown.springify().damping(15)} 
            exiting={SlideOutDown} 
            style={styles.jobPopupContainer}
          >
            <View style={styles.newJobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.pulseDot} />
                <Text style={styles.jobHeaderTitle}>ĐƠN MỚI TỚI!</Text>
              </View>
              
              <View style={styles.jobInfoRow}>
                <Ionicons name="location" size={20} color="#E74C3C" />
                <Text style={styles.jobInfoText}>Khách cách bạn: <Text style={{fontWeight: 'bold'}}>1.2 km</Text></Text>
              </View>
              
              <View style={styles.jobInfoRow}>
                <Ionicons name="construct" size={20} color="#0066CC" />
                <Text style={styles.jobInfoText}>{incomingJob.description}</Text>
              </View>

              <View style={styles.feeBox}>
                <Text style={styles.feeLabel}>Phí kiểm tra:</Text>
                <Text style={styles.feeValue}>50.000đ</Text>
              </View>

              <View style={styles.swipeContainer}>
                <Text style={styles.swipeText}>Vuốt để nhận đơn</Text>
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={[styles.swipeThumb, animatedSwipeStyle]}>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </Animated.View>
                </GestureDetector>
              </View>

              <TouchableOpacity style={styles.rejectBtn} onPress={handleRejectJob}>
                <Text style={styles.rejectBtnText}>Bỏ qua đơn này</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  floatingTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  walletText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  fabToggle: {
    width: 56, height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabOnline: { backgroundColor: '#27AE60' },
  fabOffline: { backgroundColor: '#95A5A6' },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  offlineBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  offlineText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fireIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  radarCircle: { backgroundColor: 'rgba(39, 174, 96, 0.2)', borderWidth: 1, borderColor: 'rgba(39, 174, 96, 0.4)', justifyContent: 'center', alignItems: 'center' },
  recenterBtn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#fff',
    width: 48, height: 48,
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
  jobPopupContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    zIndex: 100,
  },
  newJobCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'center' },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E74C3C', marginRight: 8 },
  jobHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#E74C3C' },
  jobInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  jobInfoText: { fontSize: 16, color: '#333', marginLeft: 12 },
  feeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF4E6', padding: 16, borderRadius: 12, marginBottom: 24, marginTop: 8 },
  feeLabel: { fontSize: 16, color: '#555' },
  feeValue: { fontSize: 20, fontWeight: 'bold', color: '#E67E22' },
  swipeContainer: { backgroundColor: '#E8F5E9', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  swipeText: { color: '#27AE60', fontSize: 16, fontWeight: 'bold' },
  swipeThumb: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 4 },
  rejectBtn: { alignItems: 'center', padding: 12 },
  rejectBtnText: { color: '#999', fontSize: 16, fontWeight: '600' }
});
