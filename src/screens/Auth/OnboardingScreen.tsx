import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this installed

const ProfileSetupScreen = () => {
  // --- State Management ---
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  
  // Dropdown visibility state
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Mock data for the dropdown
  const roles = ['Student', 'Professional', 'Recruiter', 'Freelancer', 'Other'];

  // --- Handlers ---
  const handleNext = () => {
    if (!fullName || !contact || !location || !role) {
      alert('Please fill in all fields to proceed.');
      return;
    }
    console.log({ fullName, contact, location, role });
    
    alert('Profile Saved! Proceeding to next step...');
    // Add your navigation logic here, e.g., navigation.navigate('NextScreen');
  };

  const selectRole = (item) => {
    setRole(item);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#165a54" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
       
          
          {/* --- Header Section --- */}
          <View style={styles.headerContainer}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>

            {/* Title */}
            <Text style={styles.title}>
              Let’s get to know{'\n'}about you
            </Text>
          </View>
 <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- Form Section --- */}
          <View style={styles.formContainer}>
            
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>May we know your full name?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name..."
                placeholderTextColor="#555"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Contact Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What is the best way for us to connect?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Email/Phone"
                placeholderTextColor="#555"
                value={contact}
                onChangeText={setContact}
                keyboardType="email-address"
              />
            </View>

            {/* Location Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Where are you from?</Text>
              <TextInput
                style={styles.input}
                placeholder="City/Country"
                placeholderTextColor="#555"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Role Dropdown Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Who are you?</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setDropdownVisible(true)}
              >
                <Text style={[styles.dropdownText, !role && { color: '#555' }]}>
                  {role || 'Select from below'}
                </Text>
                <Icon name="chevron-down" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* --- Next Button --- */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- Custom Dropdown Modal --- */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={roles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => selectRole(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for the body
  },
  scrollContainer: {
    flexGrow: 1,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#165a54', // The specific Teal color
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBarContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  progressSegment: {
    height: 4,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 8,
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  // Form Styles
  formContainer: {
    padding: 24,
    backgroundColor: '#000000',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#111111', // Very dark grey for input bg
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownButton: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Next Button
  nextButton: {
    backgroundColor: '#165a54',
    paddingVertical: 18,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 10,
    maxHeight: 300,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalItemText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileSetupScreen;