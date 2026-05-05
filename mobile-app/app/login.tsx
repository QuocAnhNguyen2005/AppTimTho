import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerAuth from '../components/auth/CustomerAuth';
import WorkerAuth from '../components/auth/WorkerAuth';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [activeRole, setActiveRole] = useState<'none' | 'customer' | 'worker'>('none');
  
  // Animation values
  const customerFlex = useRef(new Animated.Value(1)).current;
  const workerFlex = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const handleSelectRole = (role: 'customer' | 'worker') => {
    setActiveRole(role);
    
    Animated.parallel([
      Animated.timing(role === 'customer' ? customerFlex : workerFlex, {
        toValue: 10,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(role === 'customer' ? workerFlex : customerFlex, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleBack = () => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(customerFlex, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: false,
      }),
      Animated.timing(workerFlex, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: false,
      })
    ]).start(() => setActiveRole('none'));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Customer Section (Blue) */}
      <Animated.View style={[styles.section, { backgroundColor: '#0066CC', flex: customerFlex }]}>
        {activeRole === 'none' && (
          <TouchableOpacity 
            style={styles.touchableArea} 
            onPress={() => handleSelectRole('customer')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={64} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>Tôi muốn Tìm Thợ</Text>
            <Text style={styles.sectionSubtitle}>Dịch vụ sửa chữa tận nơi</Text>
          </TouchableOpacity>
        )}
        
        {activeRole === 'customer' && (
          <Animated.View style={{ flex: 1, opacity: formOpacity }}>
            <CustomerAuth onBack={handleBack} />
          </Animated.View>
        )}
      </Animated.View>

      {/* Worker Section (Orange) */}
      <Animated.View style={[styles.section, { backgroundColor: '#E67E22', flex: workerFlex }]}>
        {activeRole === 'none' && (
          <TouchableOpacity 
            style={styles.touchableArea} 
            onPress={() => handleSelectRole('worker')}
            activeOpacity={0.9}
          >
            <Ionicons name="build" size={64} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>Tôi là Thợ tìm việc</Text>
            <Text style={styles.sectionSubtitle}>Nhận thêm việc, tăng thu nhập</Text>
          </TouchableOpacity>
        )}
        
        {activeRole === 'worker' && (
          <Animated.View style={{ flex: 1, opacity: formOpacity }}>
            <WorkerAuth onBack={handleBack} />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    overflow: 'hidden',
  },
  touchableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
