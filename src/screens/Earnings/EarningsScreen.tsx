import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../utils/theme';

const EarningsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Earnings & Payouts</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Main Balance Card  */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>$450.00</Text>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutText}>Next Payout: Feb 01</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Committed Tier</Text></View>
          </View>
        </View>

        {/* Lifetime Stats Grid [cite: 12] */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>124</Text>
            <Text style={styles.statLabel}>Pictures Sold</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>$1.2k</Text>
            <Text style={styles.statLabel}>Lifetime Earned</Text>
          </View>
        </View>

        {/* Transaction Placeholder [cite: 13] */}
        <Text style={styles.sectionHeader}>Recent Transactions</Text>
        <View style={styles.transactionItem}>
          <Text style={styles.transTitle}>Sale: "Sunset Blvd"</Text>
          <Text style={styles.transAmount}>+$25.00</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text style={styles.transTitle}>Referral Bonus</Text>
          <Text style={styles.transAmount}>+$10.00</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  screenTitle: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.white, marginLeft: 20, marginBottom: 20 },
  scrollContent: { paddingHorizontal: 20 },
  balanceCard: { backgroundColor: COLORS.primary, padding: 25, borderRadius: 20, marginBottom: 25 },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.medium, fontSize: 14 },
  balanceAmount: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 36, marginVertical: 10 },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payoutText: { color: 'rgba(255,255,255,0.9)', fontFamily: FONTS.medium },
  badge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: COLORS.white, fontSize: 10, fontFamily: FONTS.bold, textTransform: 'uppercase' },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statBox: { flex: 1, backgroundColor: '#1A1A1A', padding: 20, borderRadius: 12, alignItems: 'center' },
  statValue: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 20, marginBottom: 5 },
  statLabel: { color: '#888', fontFamily: FONTS.medium, fontSize: 12 },
  sectionHeader: { fontFamily: FONTS.medium, fontSize: 16, color: '#888', marginBottom: 15 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  transTitle: { color: COLORS.white, fontFamily: FONTS.medium },
  transAmount: { color: '#4FD1C5', fontFamily: FONTS.bold },
});

export default EarningsScreen;