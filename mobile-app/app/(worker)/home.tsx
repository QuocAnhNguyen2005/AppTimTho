import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WorkerHome() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [hasNewJob, setHasNewJob] = useState(false);

  const translateX = useSharedValue(0);
  const swipeLimit = width - 48 - 60; // card width minus padding and button size

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  // Mock receiving a job when online
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOnline) {
      timer = setTimeout(() => {
        setHasNewJob(true);
        // Reset swipe
        translateX.value = 0;
      }, 5000); // 5 seconds after going online
    } else {
      setHasNewJob(false);
    }
    
    if (isOnline) {
      pulseScale.value = withRepeat(withTiming(2, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
      pulseOpacity.value = withRepeat(withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
    } else {
      pulseScale.value = 1;
      pulseOpacity.value = 0.5;
    }
    
    return () => clearTimeout(timer);
  }, [isOnline]);

  const handleAcceptJob = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHasNewJob(false);
    router.push('/(worker)/job-detail');
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
  const animatedPulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * 1.5 }],
    opacity: pulseOpacity.value * 0.5,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.workerName}>Thợ Nguyễn Văn A</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(worker)/profile')}>
          <Ionicons name="person-circle" size={48} color="#E67E22" />
        </TouchableOpacity>
      </View>

      {/* Online Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>{isOnline ? 'ĐANG BẬT NHẬN ĐƠN' : 'ĐANG TẮT NHẬN ĐƠN'}</Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#E67E22' }}
          thumbColor={isOnline ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#ccc"
          onValueChange={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsOnline(!isOnline);
          }}
          value={isOnline}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconBox}>
            <Ionicons name="wallet" size={24} color="#0066CC" />
          </View>
          <Text style={styles.statLabel}>Ví Tín Dụng</Text>
          <Text style={styles.statValue}>500.000đ</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconBox}>
            <Ionicons name="cash" size={24} color="#27AE60" />
          </View>
          <Text style={styles.statLabel}>Tiền mặt hôm nay</Text>
          <Text style={styles.statValue}>1.200.000đ</Text>
        </View>
      </View>

      {/* Map / Offline State Placeholder */}
      <View style={styles.mapArea}>
        {!isOnline ? (
          <View style={styles.offlineBox}>
            <Ionicons name="moon" size={64} color="#999" />
            <Text style={styles.offlineText}>Bạn đang Offline. Bật nhận đơn để bắt đầu làm việc.</Text>
          </View>
        ) : (
          <View style={styles.onlineBox}>
            <Animated.View style={[styles.radarCircle, { width: 100, height: 100, borderRadius: 50 }, animatedPulseStyle1]} />
            <Animated.View style={[styles.radarCircle, { width: 100, height: 100, borderRadius: 50, position: 'absolute' }, animatedPulseStyle2]} />
            <Ionicons name="location" size={40} color="#E67E22" style={{ position: 'absolute' }} />
            <Text style={styles.onlineText}>Đang chờ đơn mới xung quanh bạn...</Text>
          </View>
        )}
      </View>

      {/* New Job Alert Modal overlay mock */}
      {hasNewJob && (
        <View style={styles.newJobOverlay}>
          <View style={styles.newJobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.pulseDot} />
              <Text style={styles.jobHeaderTitle}>ĐƠN MỚI TỚI!</Text>
            </View>
            
            <View style={styles.jobInfoRow}>
              <Ionicons name="location" size={20} color="#E74C3C" />
              <Text style={styles.jobInfoText}>Cách bạn: <Text style={{fontWeight: 'bold'}}>2.5 km</Text></Text>
            </View>
            
            <View style={styles.jobInfoRow}>
              <Ionicons name="construct" size={20} color="#0066CC" />
              <Text style={styles.jobInfoText}>Sửa tủ lạnh không đông đá</Text>
            </View>
            
            <View style={styles.mediaPreview}>
              <Ionicons name="image" size={30} color="#999" />
              <Text style={styles.mediaPreviewText}>Khách có gửi 1 ảnh đính kèm</Text>
            </View>

            <View style={styles.feeBox}>
              <Text style={styles.feeLabel}>Phí kiểm tra:</Text>
              <Text style={styles.feeValue}>50.000đ</Text>
            </View>

            {/* Swipe to accept with Reanimated */}
            <View style={styles.swipeContainer}>
              <Text style={styles.swipeText}>Vuốt để nhận đơn</Text>
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.swipeThumb, animatedSwipeStyle]}>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </Animated.View>
              </GestureDetector>
            </View>

            <TouchableOpacity style={styles.rejectBtn} onPress={() => setHasNewJob(false)}>
              <Text style={styles.rejectBtnText}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  greeting: { fontSize: 16, color: '#666' },
  workerName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginBottom: 20 },
  toggleText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 16, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  statIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 13, color: '#666', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  mapArea: { flex: 1, backgroundColor: '#EAEAEA', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  offlineBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  offlineText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 16, lineHeight: 24 },
  onlineBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radarCircle: { backgroundColor: 'rgba(230, 126, 34, 0.1)', borderWidth: 1, borderColor: 'rgba(230, 126, 34, 0.3)', justifyContent: 'center', alignItems: 'center' },
  onlineText: { position: 'absolute', bottom: 40, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, overflow: 'hidden', fontWeight: 'bold', color: '#E67E22', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  newJobOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 100 },
  newJobCard: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 24 },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'center' },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E74C3C', marginRight: 8 },
  jobHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#E74C3C' },
  jobInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  jobInfoText: { fontSize: 16, color: '#333', marginLeft: 12 },
  mediaPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 12, borderRadius: 8, marginTop: 8, marginBottom: 16 },
  mediaPreviewText: { marginLeft: 12, color: '#666', fontStyle: 'italic' },
  feeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF4E6', padding: 16, borderRadius: 12, marginBottom: 24 },
  feeLabel: { fontSize: 16, color: '#555' },
  feeValue: { fontSize: 20, fontWeight: 'bold', color: '#E67E22' },
  acceptBtn: { backgroundColor: '#27AE60', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', shadowColor: '#27AE60', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5, marginBottom: 16 },
  acceptBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  swipeContainer: { backgroundColor: '#E8F5E9', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  swipeText: { color: '#27AE60', fontSize: 16, fontWeight: 'bold' },
  swipeThumb: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 4 },
  rejectBtn: { alignItems: 'center', padding: 12 },
  rejectBtnText: { color: '#999', fontSize: 16, fontWeight: '600' }
});
