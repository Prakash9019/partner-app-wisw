import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/theme';

const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Feed & Notifications</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Resource Hub Section  */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Resource Hub</Text>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="book-outline" size={24} color={COLORS.primary} />
            <View style={{marginLeft: 15}}>
              <Text style={styles.cardTitle}>Creation Guidelines</Text>
              <Text style={styles.cardSubtitle}>Best practices for work that sells</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications Section  */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recent Activity</Text>
          <View style={styles.notificationCard}>
            <View style={styles.dot} />
            <Text style={styles.notifText}>Your collection "Urban Life" was approved.</Text>
            <Text style={styles.timeText}>2h ago</Text>
          </View>
          <View style={styles.notificationCard}>
            <View style={[styles.dot, {backgroundColor: 'transparent'}]} />
            <Text style={styles.notifText}>Welcome to Wall is Well! Complete your KYC.</Text>
            <Text style={styles.timeText}>1d ago</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  screenTitle: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.white, marginLeft: 20, marginBottom: 20 },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { fontFamily: FONTS.medium, fontSize: 16, color: '#888', marginBottom: 15 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 20, borderRadius: 12 },
  cardTitle: { fontFamily: FONTS.bold, color: COLORS.white, fontSize: 16 },
  cardSubtitle: { fontFamily: FONTS.medium, color: '#666', fontSize: 12 },
  notificationCard: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222', paddingVertical: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 15 },
  notifText: { color: COLORS.white, fontFamily: FONTS.medium, flex: 1 },
  timeText: { color: '#666', fontFamily: FONTS.medium, fontSize: 12 },
});

export default FeedScreen;