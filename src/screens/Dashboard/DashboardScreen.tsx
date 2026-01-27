import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/theme';

// --- TYPE DEFINITIONS (Fixes your errors) ---
interface Metric {
  label: string;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: Metric[];
  total: number;
}

interface NavItemProps {
  icon: keyof typeof Ionicons.glyphMap; // Ensures only valid icon names are used
  label: string;
  active?: boolean;
}

// --- REUSABLE DONUT CHART COMPONENT ---
const DonutChart: React.FC<DonutChartProps> = ({ data, total }) => {
  const radius = 80;
  const strokeWidth = 12;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Explicitly typing 'acc' and 'item' fixes the reduce error
  const totalPercentage = data.reduce((acc: number, item: Metric) => acc + item.percentage, 0);
  
  let currentAngle = 0;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
      <Svg width={center * 2} height={center * 2} viewBox={`0 0 ${center * 2} ${center * 2}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item: Metric, index: number) => {
            const percentageOfTotal = item.percentage / totalPercentage;
            // const strokeDashoffset = circumference - (circumference * percentageOfTotal); // Unused variable
            const angle = (item.percentage / totalPercentage) * 360;
            
            const dashArray = [
              circumference * percentageOfTotal - 5, // Length of segment
              circumference // Rest is empty
            ];

            const segment = (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeLinecap="round"
                rotation={currentAngle}
                origin={`${center}, ${center}`}
                fill="transparent"
              />
            );

            currentAngle += angle;
            return segment;
          })}
        </G>
      </Svg>
      
      {/* Center Text */}
      <View style={styles.chartCenterText}>
        <Text style={styles.chartTotalText}>{total.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  // --- MOCK DATA ---
  const dashboardData = {
    userName: "Amit Gupta",
    role: "PHOTOGRAPHER",
    totalReach: 13000,
    growth: 150,
    metrics: [
      { label: "Total Follows", percentage: 5, color: '#D9D9D9' }, 
      { label: "Total Saves", percentage: 15, color: '#7E8A8C' },  
      { label: "Total Likes", percentage: 18, color: '#2A9D8F' },  
      { label: "Total Views", percentage: 72, color: '#104F49' },  
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER SECTION --- */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{dashboardData.userName}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{dashboardData.role}</Text>
            </View>
          </View>
        </View>

        {/* --- MAIN CARD --- */}
        <View style={styles.card}>
          
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total Account Reach</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Last 30 days</Text>
              <Ionicons name="chevron-down" size={14} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Donut Chart */}
          <DonutChart data={dashboardData.metrics} total={dashboardData.totalReach} />

          {/* Metrics Legend */}
          <View style={styles.legendContainer}>
            {dashboardData.metrics.map((metric, index) => (
              <View key={index} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.dot, { backgroundColor: metric.color }]} />
                  <Text style={styles.legendLabel}>{metric.label}</Text>
                </View>
                <Text style={styles.legendValue}>{metric.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={styles.footerLabel}>Accounts Reached </Text>
               <Text style={styles.growthText}>(+{dashboardData.growth}%)</Text>
            </View>
            <Text style={styles.footerValue}>{dashboardData.totalReach.toLocaleString()}</Text>
          </View>

        </View>

      </ScrollView>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomNav}>
        <NavItem icon="grid" label="Dashboard" active />
        <NavItem icon="layers" label="Collections" />
        <NavItem icon="chatbox-ellipses" label="Feed" /> 
        <NavItem icon="wallet" label="Earnings" />
        <NavItem icon="person" label="Account" />
      </View>

    </SafeAreaView>
  );
};

// Helper for Bottom Nav Item
const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => (
  <TouchableOpacity style={styles.navItem}>
    <View style={active ? styles.activeIcon : null}>
       <Ionicons name={icon} size={22} color={active ? COLORS.primary : '#666'} />
    </View>
    <Text style={[styles.navLabel, { color: active ? COLORS.primary : '#666' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, 
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  nameText: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.primary, 
  },
  roleBadge: {
    backgroundColor: '#104F49', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: '#4FD1C5',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.white,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  dropdownText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: '#888',
  },
  chartCenterText: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartTotalText: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.white,
  },
  legendContainer: {
    marginTop: 20,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  legendValue: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  growthText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#4FD1C5', 
  },
  footerValue: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.white,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  activeIcon: {
    // Optional
  },
  navLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
});

export default DashboardScreen;