import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView,  Modal, FlatList, Dimensions, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '../../utils/theme';
import FormInput from '../../components/FormInput';

const { height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'filling' | 'pending' | 'approved'>('filling'); 

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '', contact: '', location: '', role: '', 
    photographerType: '', portfolio: '', genres: '', openToCommissions: '',
    hearAboutUs: '', goals: '', updatesConsent: '',
  });

  // Dropdown State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);

  // --- LOGIC ---
  const getHeaderTitle = () => {
    if (status === 'pending') return "Approval pending\nfor onboarding";
    if (step === 1) return "Let's get to know\nabout you";
    if (step === 2) return "Tell us about your\nwork";
    if (step === 3) return "Almost there...\nJust a few details";
    return "";
  };

  const openPicker = (field: string, options: string[]) => {
    setCurrentField(field);
    setModalOptions(options);
    setModalVisible(true);
  };

  const handleSelect = (value: string) => {
    setFormData({ ...formData, [currentField]: value });
    setModalVisible(false);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Submitting:", formData);
      setStatus('pending');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleCheckStatus = () => {
    // Demo logic: Switch to approved
    setStatus('approved'); 
  };

  // --- RENDER CONTENT (Fields Only - No Titles) ---
  const renderStepContent = () => {
    if (status === 'pending') return renderPending();
    if (step === 1) return (
      <View>
        <FormInput 
          label="May we know your full name?" placeholder="Enter your name..."
          value={formData.fullName} onChangeText={(t) => setFormData({ ...formData, fullName: t })}
        />
        <FormInput 
          label="What is the best way for us to connect?" placeholder="Enter your Email/Phone"
          value={formData.contact} onChangeText={(t) => setFormData({ ...formData, contact: t })}
        />
        <FormInput 
          label="Where are you from?" placeholder="City/Country"
          value={formData.location} onChangeText={(t) => setFormData({ ...formData, location: t })}
        />
        <Dropdown label="Who are you?" value={formData.role} 
          onPress={() => openPicker('role', ['Photographer', 'Visual Artist', 'Agency'])} />
      </View>
    );
    if (step === 2) return (
      <View>
        <Dropdown label="Which of these best describes you?" value={formData.photographerType} 
          onPress={() => openPicker('photographerType', ['Hobbyist', 'Professional', 'Freelancer'])} />
        <FormInput 
          label="Link to your portfolio?" placeholder="Website / Instagram..."
          value={formData.portfolio} onChangeText={(t) => setFormData({ ...formData, portfolio: t })}
        />
        <Dropdown label="Which genres do you work in?" value={formData.genres} 
          onPress={() => openPicker('genres', ['Street', 'Travel', 'Portrait', 'Architecture'])} />
        <Dropdown label="Open to commissions?" value={formData.openToCommissions} 
          onPress={() => openPicker('openToCommissions', ['Yes', 'No'])} />
      </View>
    );
    if (step === 3) return (
      <View>
        <Dropdown label="How did you hear about us?" value={formData.hearAboutUs} 
          onPress={() => openPicker('hearAboutUs', ['Instagram', 'LinkedIn', 'Search'])} />
        <FormInput 
          label="Anything about your work/goals?" placeholder="Write here..."
          value={formData.goals} onChangeText={(t) => setFormData({ ...formData, goals: t })}
          multiline numberOfLines={3}
        />
        <Dropdown label="Receive updates?" value={formData.updatesConsent} 
          onPress={() => openPicker('updatesConsent', ['Yes, please', 'No, thanks'])} />
      </View>
    );
  };

  const renderPending = () => (
    <View style={styles.centerContent}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={"hourglass" as any} size={40} color="white" />
      </View>
      <Text style={styles.statusText}>
        Your profile has been submitted and waiting for approval.
      </Text>
    </View>
  );

  const renderApproved = () => (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }]}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="check" size={30} color="white" />
      </View>
      <Text style={styles.statusText}>Your profile has been approved.</Text>
      <TouchableOpacity style={[styles.nextButton, { width: '100%', marginTop: 50 }]} onPress={() => router.replace('/dashboard')}>
        <Text style={styles.nextButtonText}>Restart App</Text>
      </TouchableOpacity>
    </View>
  );

  // Helper Component for Dropdowns
  const Dropdown = ({ label, value, onPress }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdownTrigger} onPress={onPress}>
        <Text style={{ color: value ? COLORS.white : '#666' }}>{value || "Select from below"}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  // --- MAIN LAYOUT ---
  if (status === 'approved') return renderApproved();

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER (Fixed at Top) */}
      <View style={styles.header}>
        <SafeAreaView style={styles.headerSafeArea}>
          {/* Top Row: Back & Progress */}
          <View style={styles.headerTopRow}>
            {status === 'filling' ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
            ) : <View style={{width: 40}} />} {/* Spacer if no back button */}

            {/* Progress Bars */}
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.progressBar, { 
                  backgroundColor: (status === 'pending' || i <= step) ? COLORS.white : 'rgba(255,255,255,0.3)' 
                }]} />
              ))}
            </View>
          </View>

          {/* Title Area (Inside Teal Header) */}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* 2. SCROLLABLE CONTENT (Middle) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 3. FOOTER (Fixed at Bottom) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={status === 'filling' ? handleNext : handleCheckStatus}
        >
          <Text style={styles.nextButtonText}>
            {status === 'filling' ? "Next" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList data={modalOptions} keyExtractor={i => i} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(item)}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}/>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // --- HEADER STYLES ---
  header: {
    backgroundColor: COLORS.primary, // Teal
    height: height * 0.35, // 35% of screen height
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerSafeArea: {
    flex: 1,
    justifyContent: 'space-between', // Pushes Title to bottom of header
    paddingBottom: 30, // Space from bottom of teal area
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 15,
  },
  backButton: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20,
  },
  progressContainer: {
    flex: 1, flexDirection: 'row', gap: 8,
  },
  progressBar: {
    flex: 1, height: 4, borderRadius: 2,
  },
  headerTitleContainer: {
    marginBottom: 10, 
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 36, // Better spacing for 2 lines
  },
  // --- BODY STYLES ---
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra scroll space for footer
  },
  centerContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  statusText: {
    color: COLORS.white, fontFamily: FONTS.medium, fontSize: 16, textAlign: 'center', lineHeight: 24,
  },
  label: {
    color: COLORS.white, fontFamily: FONTS.medium, fontSize: 14, marginBottom: 8,
  },
  dropdownTrigger: {
    backgroundColor: '#1A1A1A', borderRadius: 8, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  // --- FOOTER STYLES ---
  footer: {
    padding: 20,
    paddingBottom: 40, // Safe area for bottom
    backgroundColor: COLORS.background, // Black bg so it blends
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white, fontFamily: FONTS.medium, fontSize: 16,
  },
  // --- MODAL ---
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#222', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  modalItemText: { color: 'white', fontSize: 16, textAlign: 'center' },
});

export default OnboardingScreen;