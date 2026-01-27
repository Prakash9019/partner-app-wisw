import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
// If you haven't built the Login UI yet, use this placeholder:
export default function Page() {
  const router = useRouter();
  return (
    <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'white', fontSize: 20}}>Login Screen (Work in Progress)</Text>
      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
        <Text style={{color: 'teal'}}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}