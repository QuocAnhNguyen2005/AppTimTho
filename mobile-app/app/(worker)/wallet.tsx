import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  const transactions = [
    { id: '1', title: 'Trừ phí hoa hồng (Đơn #1234)', amount: '- 23.250đ', date: '05/05/2026 14:30', type: 'deduct' },
    { id: '2', title: 'Nạp tiền vào ví', amount: '+ 200.000đ', date: '04/05/2026 09:15', type: 'topup' },
    { id: '3', title: 'Trừ phí hoa hồng (Đơn #1230)', amount: '- 15.500đ', date: '03/05/2026 16:45', type: 'deduct' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ví Tín Dụng</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={transactions}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              {/* Balance Card */}
              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
                <Text style={styles.balanceAmount}>500.000 đ</Text>
                <Text style={styles.balanceNote}>
                  * Hệ thống tự động trừ 15.5% hoa hồng trên mỗi đơn hoàn thành. Vui lòng duy trì số dư lớn hơn 0 để nhận đơn mới.
                </Text>
              </View>

              {/* Topup Instructions */}
              <View style={styles.topupSection}>
                <Text style={styles.sectionTitle}>Hướng dẫn nạp tiền</Text>
                <View style={styles.bankCard}>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Ngân hàng:</Text>
                    <Text style={styles.bankValue}>Vietcombank</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Số tài khoản:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.bankValue}>0123456789</Text>
                      <TouchableOpacity style={{ marginLeft: 8 }}>
                        <Ionicons name="copy-outline" size={16} color="#0066CC" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                    <Text style={styles.bankValue}>CTY APP TIM THO</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Nội dung CK:</Text>
                    <View style={styles.syntaxBox}>
                      <Text style={styles.syntaxText}>NAP U001</Text>
                    </View>
                  </View>
                  <Text style={styles.bankNote}>(Tiền sẽ tự động cập nhật vào ví trong 1-3 phút)</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>
            </>
          }
          renderItem={({ item: tx }) => (
            <View style={styles.txItem}>
              <View style={styles.txIconBox}>
                <Ionicons 
                  name={tx.type === 'topup' ? 'arrow-down' : 'arrow-up'} 
                  size={20} 
                  color={tx.type === 'topup' ? '#27AE60' : '#E74C3C'} 
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'topup' ? '#27AE60' : '#E74C3C' }]}>
                {tx.amount}
              </Text>
            </View>
          )}
          keyExtractor={(tx) => tx.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 16, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  balanceCard: { backgroundColor: '#E67E22', borderRadius: 20, padding: 24, shadowColor: '#E67E22', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, marginBottom: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  balanceNote: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontStyle: 'italic', lineHeight: 18, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  topupSection: { marginBottom: 24 },
  bankCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEE' },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bankLabel: { fontSize: 14, color: '#666' },
  bankValue: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  syntaxBox: { backgroundColor: '#F0F8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#BCE0FD' },
  syntaxText: { color: '#0066CC', fontWeight: 'bold', fontSize: 16 },
  bankNote: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
  historySection: {},
  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  txIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  txDate: { fontSize: 12, color: '#999' },
  txAmount: { fontSize: 15, fontWeight: 'bold' }
});
