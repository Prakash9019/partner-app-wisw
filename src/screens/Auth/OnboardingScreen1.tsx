import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '../../utils/theme';
import FormInput from '../../components/FormInput';
import axiosClient from "../../api/axiosClient";
const { height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  
  // --- STATE ---
  const [step, setStep] = useState(1);
  // status: 'filling' -> 'submitted' (KYC Submitted) -> 'approved' (Admin Approved)
  const [status, setStatus] = useState<'filling' | 'pending' | 'approved' | 'submitted'>('filling'); 
  const [loading, setLoading] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '', contact: '', location: '', role: '', 
    // Step 2
    photographerType: '', portfolio: '', genres: '', openToCommissions: '',
    // Step 3
    hearAboutUs: '', goals: '', updatesConsent: '',
    // Step 4 (KYC)
    panNumber: '', accountNumber: '', ifscCode: ''
  });

  // Dropdown State
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);

  // --- LOGIC ---
  const getHeaderTitle = () => {
    // if (status === 'submitted') return "Approval pending\nfor onboarding";
    if (step === 1) return "Let's get to know\nabout you";
    if (step === 2) return "Tell us about your\nwork";
    if (step === 3) return "Almost there...\nJust a few details";
    if (step === 4) return "Profile & KYC\nDetails"; // New Step Title
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

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // SUBMIT KYC DATA TO BACKEND
      // SUBMIT KYC DATA TO BACKEND
      setLoading(true);
      try {

        console.log("Submitting KYC Data:", formData);
        
        // POST request to your backend route
        const res = await axiosClient.post('/auth/onboarding', formData);
        
        if (res.status === 200) {
           // On success, switch UI to 'submitted' (Pending Screen)
           setStatus('submitted');
        }
      } catch (error: any) {
        console.error(error);
        Alert.alert("Submission Failed", error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  // --- RESTART / CHECK STATUS LOGIC ---
  const handleCheckStatus = () => {
    if (status === 'submitted') {
      setLoading(true);
      // SIMULATE BACKEND CHECK
      setTimeout(() => {
        setLoading(false);
        // Simulate Admin Approval
        setStatus('approved'); 
      }, 1500);
    } else if (status === 'approved') {
      // Navigate to Dashboard
      router.replace('/(tabs)/dashboard');
    }
  };

  // --- RENDER CONTENT ---
  const renderStepContent = () => {
     if (status === 'submitted') {
    return (
      <View style={styles.fullScreenCenter}>
        {renderPending()}
      </View>
    );
  }
    
    // STEP 1
    if (step === 1) return (
      <View>
        <FormInput label="May we know your full name?" placeholder="Enter your name..." value={formData.fullName} onChangeText={(t) => setFormData({ ...formData, fullName: t })} />
        <FormInput label="What is the best way for us to connect?" placeholder="Enter your Email/Phone" value={formData.contact} onChangeText={(t) => setFormData({ ...formData, contact: t })} />
        <FormInput label="Where are you from?" placeholder="City/Country" value={formData.location} onChangeText={(t) => setFormData({ ...formData, location: t })} />
        <Dropdown label="Who are you?" value={formData.role} onPress={() => openPicker('role', ['Photographer', 'Visual Artist', 'Agency'])} />
      </View>
    );
    // STEP 2
    if (step === 2) return (
      <View>
        <Dropdown label="Which of these best describes you?" value={formData.photographerType} onPress={() => openPicker('photographerType', ['Hobbyist', 'Professional', 'Freelancer'])} />
        <FormInput label="Link to your portfolio?" placeholder="Website / Instagram..." value={formData.portfolio} onChangeText={(t) => setFormData({ ...formData, portfolio: t })} />
        <Dropdown label="Which genres do you work in?" value={formData.genres} onPress={() => openPicker('genres', ['Street', 'Travel', 'Portrait', 'Architecture'])} />
        <Dropdown label="Open to commissions?" value={formData.openToCommissions} onPress={() => openPicker('openToCommissions', ['Yes', 'No'])} />
      </View>
    );
    // STEP 3
    if (step === 3) return (
      <View>
        <Dropdown label="How did you hear about us?" value={formData.hearAboutUs} onPress={() => openPicker('hearAboutUs', ['Instagram', 'LinkedIn', 'Search'])} />
        <FormInput label="Anything about your work/goals?" placeholder="Write here..." value={formData.goals} onChangeText={(t) => setFormData({ ...formData, goals: t })} multiline numberOfLines={3} />
        <Dropdown label="Receive updates?" value={formData.updatesConsent} onPress={() => openPicker('updatesConsent', ['Yes, please', 'No, thanks'])} />
      </View>
    );
    // STEP 4: KYC DETAILS
    if (step === 4) return (
      <View>
        <FormInput label="PAN Number" placeholder="Enter PAN Number" value={formData.panNumber} onChangeText={(t) => setFormData({ ...formData, panNumber: t })} autoCapitalize="characters" />
        <FormInput label="Account Number" placeholder="Enter Account Number" value={formData.accountNumber} onChangeText={(t) => setFormData({ ...formData, accountNumber: t })} keyboardType="numeric" />
        <FormInput label="IFSC Code" placeholder="Enter IFSC Code" value={formData.ifscCode} onChangeText={(t) => setFormData({ ...formData, ifscCode: t })} autoCapitalize="characters" />
      </View>
    );
  };

  // PENDING STATE
  const renderPending = () => (
    <View style={[styles.container,styles.centerContent]}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="hourglass-start" size={40} color="white" />
      </View>
      <Text style={styles.statusText}>
        Your profile has been submitted and is waiting for KYC approval.
      </Text>
    </View>
  );

  // APPROVED STATE
  const renderApproved = () => (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', }]}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="check" size={30} color="white" />
      </View>
      <Text style={styles.statusText}>Your profile has been approved.</Text>
      
      <TouchableOpacity 
        style={[styles.nextButton, {  marginTop: 50, paddingHorizontal: 50  }]} 
        onPress={handleCheckStatus}
      >
        <Text style={styles.nextButtonText}>Restart App</Text>
      </TouchableOpacity>
    </View>
  );

  // Dropdown Component
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
      
      {/* 1. HEADER */}
      {/* <View style={styles.header}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerTopRow}>
            {status === 'filling' ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={COLORS.white} />
              </TouchableOpacity>
            ) : <View style={{width: 45}} />}

            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.progressBar, { 
                  backgroundColor: (status === 'pending' || i <= step) ? COLORS.white : 'rgba(255,255,255,0.3)' 
                }]} />
              ))}
            </View>
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          </View>
        </SafeAreaView>
      </View> */}

      {status === 'filling' && (
  <View style={styles.header}>
    <SafeAreaView style={styles.headerSafeArea}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressBar,
                {
                  backgroundColor:
                    i <= step ? COLORS.white : 'rgba(255,255,255,0.3)',
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
      </View>
    </SafeAreaView>
  </View>
)}


      {/* 2. BODY */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 3. FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={status === 'filling' ? handleNext : handleCheckStatus}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text style={styles.nextButtonText}>
               {status === 'filling' ? (step === 4 ? "Continue" : "Next") : "Restart App"}
             </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* {status === 'filling' && (
  <View style={styles.footer}>
    <TouchableOpacity
      style={styles.nextButton}
      onPress={handleNext}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.nextButtonText}>
          {step === 4 ? 'Continue' : 'Next'}
        </Text>
      )}
    </TouchableOpacity>
  </View>
)} */}


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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, height: height * 0.35, paddingHorizontal: 20 },
  headerSafeArea: { flex: 1, justifyContent: 'space-between', paddingBottom: 30 },
  headerTopRow: { gap: 15, flexDirection: 'column', paddingTop: 20 },
  backButton: { width: 45, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15 },
  progressContainer: { flexDirection: 'row', marginBottom: 24 },
  progressBar: { height: 4, flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8, borderRadius: 2 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.white, lineHeight: 36 },
  headerTitleContainer: { marginBottom: 10 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  statusText: { color: COLORS.white, fontFamily: FONTS.medium, fontSize: 16, textAlign: 'center', lineHeight: 24, marginHorizontal: 30 },
  label: { color: COLORS.white, fontFamily: FONTS.medium, fontSize: 14, marginBottom: 8 },
  dropdownTrigger: { backgroundColor: '#1A1A1A', borderRadius: 8, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { padding: 20, paddingBottom: 40, backgroundColor: COLORS.background },
  nextButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  nextButtonText: { color: COLORS.white, fontFamily: FONTS.medium, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#222', borderRadius: 12, padding: 10, maxHeight: 300 },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  modalItemText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
  fullScreenCenter: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

});

export default OnboardingScreen;