import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { COLORS, FONTS } from '../../utils/theme';
import { useRouter } from 'expo-router'; // Use this for navigation
import { SafeAreaView } from 'react-native-safe-area-context';
const WelcomeScreen = () => {
  const router = useRouter();
  
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Main Title Area */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>WALL IS WELL</Text>
          <Text style={styles.subtitle}>FOR PARTNERS</Text>
        </View>

        {/* Buttons Area */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.push('/signup')} 
          >
            <Text style={styles.primaryButtonText}>Create Your Free Account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryLink}>LOGIN TO EXISTING ACCOUNT</Text>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    // Using a condensed style for the logo look based on image
    fontFamily: FONTS.bold, 
    fontSize: 42,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 50,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 2,
    marginTop: 5,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.white,
  },
  secondaryLink: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;