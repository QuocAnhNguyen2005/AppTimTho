import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSelectRole = (role: 'customer' | 'worker') => {
    login(role);
    if (role === 'customer') {
      router.replace('/(customer)/home');
    } else {
      router.replace('/(worker)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bạn là ai?</Text>
        <Text style={styles.subtitle}>Chọn vai trò của bạn để tiếp tục</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.card, styles.customerCard]} 
          onPress={() => handleSelectRole('customer')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="search" size={48} color="#0066CC" />
          </View>
          <Text style={styles.cardTitle}>Khách tìm thợ</Text>
          <Text style={styles.cardDesc}>Tôi cần tìm thợ sửa chữa, bảo trì cho gia đình hoặc công ty.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.workerCard]} 
          onPress={() => handleSelectRole('worker')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="build" size={48} color="#E67E22" />
          </View>
          <Text style={styles.cardTitle}>Thợ tìm việc</Text>
          <Text style={styles.cardDesc}>Tôi là thợ chuyên nghiệp, muốn nhận thêm công việc để tăng thu nhập.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  customerCard: {
    borderTopWidth: 4,
    borderTopColor: '#0066CC',
  },
  workerCard: {
    borderTopWidth: 4,
    borderTopColor: '#E67E22',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
