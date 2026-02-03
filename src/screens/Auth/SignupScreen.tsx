import { AntDesign, Ionicons } from "@expo/vector-icons"; // For Icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosClient from "../../api/axiosClient";
import wisw from "../../assets/wisw.png"; // Import the logo image
import { COLORS, FONTS } from "../../utils/theme";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    "786143538820-5cgu51uft3ihl0aghurv9rnern0igcqa.apps.googleusercontent.com",
    offlineAccess: true,
});

export let loginConfirmation: any = null;

const SignupScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  /* Helper: Save Token & Redirect */
  const handleBackendAuth = async (firebaseToken: string) => {
    try {
      // Send Firebase Token to your Backend
      const res = await axiosClient.post("/auth/login-google-firebase", {
        token: firebaseToken,
      });

      const backendToken = res.data.token; // Assuming your API returns { token: "..." }

      await AsyncStorage.setItem("token", backendToken);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${backendToken}`;
      alert("Success");
      router.push("/onboarding");
    } catch (error: any) {
      console.error("Backend Auth Error:", error);
      Alert.alert("Login Failed", "Could not verify with server.");
    }
  };

  /* 🟢 Google Login Logic */
  const handleGoogleLogin = async () => {
    // setLoading(true);
    try {
      // 1. Check Play Services
      await GoogleSignin.hasPlayServices();

      // 2. Get ID Token
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (!idToken) throw new Error("No ID Token found");

      // 3. Create Credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // 4. Sign In to Firebase
      const userCredential =
        await auth().signInWithCredential(googleCredential);
      console.log("Firebase User:", userCredential.user);
      // 5. Get JWT Token for Backend
      const firebaseToken = await userCredential.user.getIdToken();
      // console.log("Firebase Token:", firebaseToken);
      // 6. Send to Backend
      await handleBackendAuth(firebaseToken);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled login");
      } else {
        console.error(error);
        Alert.alert("Google Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Box Logo Area */}
        <Image source={wisw} style={styles.logoSection} />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>SIGNUP VIA</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        <View style={styles.buttonContainer}>
          {/* Google Button */}
          <TouchableOpacity
            style={styles.socialButtonTeal}
            onPress={handleGoogleLogin}
          >
            <AntDesign
              name="google"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.socialButtonTextWhite}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity style={styles.socialButtonWhite}>
            <AntDesign
              name="apple"
              size={20}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.socialButtonTextBlack}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center", // Centers the logo vertically
  },
  logoSection: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 60,
    resizeMode: "contain",
  },
  logoTopText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.medium,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  logoBottomText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.medium,
    letterSpacing: 2,
    marginTop: 8,
    textTransform: "uppercase",
  },
  boxLogo: {
    borderWidth: 2,
    borderColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 4,
  },
  boxLogoText: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: COLORS.white,
    lineHeight: 40,
    textTransform: "uppercase",
  },
  boxLogoSmallText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: COLORS.white,
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: FONTS.medium,
    textTransform: "uppercase",
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  socialButtonTeal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
  },
  socialButtonWhite: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 30,
  },
  icon: {
    marginRight: 10,
  },
  socialButtonTextWhite: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  socialButtonTextBlack: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
});

export default SignupScreen;
