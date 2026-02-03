import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check for token (Uncomment when you have auth setup)
      // const token = await AsyncStorage.getItem("token");
      
      const token = null; // MOCK: Simulate not logged in
      
      if (token) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/(auth)/welcome");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#11524F" />
    </View>
  );
}