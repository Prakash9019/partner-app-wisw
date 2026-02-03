
import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from "../../src/utils/theme"; // Adjust path if needed
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Match the black/dark grey design from PDF [cite: 91, 147, 246]
       tabBarStyle: {
      backgroundColor: '#000000',
      borderTopColor: '#1A1A1A',
      borderTopWidth: 1,

      // ✅ Key fix
      paddingBottom: insets.bottom + 8,
      paddingTop: 10,
      height: 60 + insets.bottom,
    },
        tabBarActiveTintColor: COLORS.primary, // Teal for active tab [cite: 147]
        tabBarInactiveTintColor: '#666666',    // Grey for inactive
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          marginTop: -5,
        },
      }}
    >
      {/* 1. DASHBOARD TAB [cite: 91] */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "view-grid" : "view-grid-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* 2. COLLECTIONS TAB [cite: 147] */}
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "images" : "images-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* 3. FEED TAB [cite: 246] */}
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* 4. EARNINGS TAB [cite: 252] */}
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "wallet" : "wallet-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* 5. PROFILE TAB [cite: 398] */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name={focused ? "user-alt" : "user"} 
              size={20} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}