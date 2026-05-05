import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomerHome() {
  const router = useRouter();

  const services = [
    { id: 1, name: 'Sửa Điện', icon: 'flash', color: '#FF9800' },
    { id: 2, name: 'Sửa Nước', icon: 'water', color: '#03A9F4' },
    { id: 3, name: 'Điện Lạnh', icon: 'snow', color: '#00BCD4' },
    { id: 4, name: 'Thông Tắc', icon: 'construct', color: '#795548' },
    { id: 5, name: 'Thợ Xây', icon: 'hammer', color: '#607D8B' },
    { id: 6, name: 'Vệ Sinh', icon: 'leaf', color: '#4CAF50' },
  ];

  return (
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
});
