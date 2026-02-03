import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axiosClient from "../../api/axiosClient";
import Logo1 from '../../assets/wisw.png';
// --- CONSTANTS ---
const { width } = Dimensions.get('window');
const COLORS = {
  black: '#000000',
  darkGray: '#121212',
  inputBg: '#0A0A0A', // Very dark gray for inputs
  teal: '#11524F',
  tealAccent: '#18AAA3',
  white: '#FFFFFF',
  grayText: '#999999',
  border: '#333333',
};

const ProfileScreen = () => {
  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('RECENT');

  // Form Data State
  const [formData, setFormData] = useState({
    name: 'Amit Gupta',
    about: 'Professional Photographer based in Mumbai.',
    location: 'Gurgaon, India',
    website: '',
    instagram: '',
    twitter: '', 
    pinterest: '',
    avatar: 'https://i.pravatar.cc/300?img=11', 
  });

  // --- HANDLERS ---

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('about', formData.about); // Maps to bio
      data.append('location', formData.location);
      data.append('website', formData.website); // Maps to portfolioLink
      data.append('instagram', formData.instagram);
      data.append('twitter', formData.twitter);
      data.append('pinterest', formData.pinterest);

      // Handle Image
      if (formData.avatar && !formData.avatar.startsWith('http')) {
        const filename = formData.avatar.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        
        // @ts-ignore
        data.append('avatar', {
          uri: formData.avatar,
          name: filename || 'avatar.jpg',
          type,
        });
      }

      // API CALL
      const res = await axiosClient.patch('/partner/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    if (isEditing) {
      setShowSaveModal(true);
    } else {
      // Normal navigation back logic if needed
    }
  };

  // --- RENDER: EDIT VIEW (Matches Screens 31 & 32) ---
  const renderEditView = () => (
    <View style={styles.editContainer}>
     
      {/* Top Bar */}
      <View style={styles.editHeader}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.tealAccent} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.editScroll}>
        {/* Avatar Upload (Screen 32) */}
        <View style={styles.avatarEditContainer}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: formData.avatar }} style={styles.avatarLarge} />
            {/* The "+" Button Overlay */}
            <TouchableOpacity style={styles.plusIconOverlay} onPress={pickImage}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            value={formData.name}
            onChangeText={(t) => setFormData({...formData, name: t})}
            placeholder="Enter Name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>About</Text>
          <TextInput 
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
            value={formData.about}
            onChangeText={(t) => setFormData({...formData, about: t})}
            placeholder="Write about yourself"
            placeholderTextColor="#666"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City/Country</Text>
          <TextInput 
            style={styles.input} 
            value={formData.location}
            onChangeText={(t) => setFormData({...formData, location: t})}
            placeholder="Gurgaon, India"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Website</Text>
          <View style={styles.iconInputContainer}>
            <Ionicons name="link" size={20} color="white" style={styles.inputIcon} />
            <TextInput 
              style={styles.iconInput} 
              value={formData.website}
              onChangeText={(t) => setFormData({...formData, website: t})}
              placeholder="url.com"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Social Links */}
        <Text style={[styles.label, { marginTop: 15 }]}>Social</Text>
        
        <View style={styles.socialInputRow}>
          <View style={styles.iconInputContainer}>
            <FontAwesome name="instagram" size={20} color="white" style={styles.inputIcon} />
            <TextInput 
              style={styles.iconInput} 
              value={formData.instagram}
              onChangeText={(t) => setFormData({...formData, instagram: t})}
              placeholder="instagram.com/"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.socialInputRow}>
          <View style={styles.iconInputContainer}>
            {/* X Icon */}
            <Text style={[styles.inputIcon, {fontSize:18, fontWeight:'bold', color:'white'}]}>X</Text>
            <TextInput 
              style={styles.iconInput} 
              value={formData.twitter}
              onChangeText={(t) => setFormData({...formData, twitter: t})}
              placeholder="x.com/"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.socialInputRow}>
          <View style={styles.iconInputContainer}>
            <FontAwesome name="pinterest" size={20} color="white" style={styles.inputIcon} />
            <TextInput 
              style={styles.iconInput} 
              value={formData.pinterest}
              onChangeText={(t) => setFormData({...formData, pinterest: t})}
              placeholder="pinterest.com/"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={{height: 100}} /> 
      </ScrollView>
    </View>
  );

  // RENDER: VIEW PROFILE (Matches Screen 30)
  const renderProfileView = () => (
    <View style={styles.container}>
      {/* Top Logo */}
    <View style={styles.topLogo}>
  <View style={styles.logoContainer}>
    <Image
      source={Logo1} // adjust path if needed
      style={styles.logoImage}
      resizeMode="contain"
    />
  </View>
</View>
      
      {/* Header Info */}
      <View style={styles.header}>
        <Image source={{ uri: formData.avatar }} style={styles.profileAvatar} />
        <View style={styles.headerText}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={styles.userName}>{formData.name.toUpperCase()}</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>ALL IN</Text></View>
          </View>
          <View style={styles.stats}>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>20</Text>
    <Text style={styles.statLabel}>Images</Text>
  </View>

  <View style={styles.statItem}>
    <Text style={styles.statNumber}>0</Text>
    <Text style={styles.statLabel}>Followers</Text>
  </View>

  <View style={styles.statItem}>
    <Text style={styles.statNumber}>6</Text>
    <Text style={styles.statLabel}>Saves</Text>
  </View>
</View>

        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.btnText}>EDIT PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.btnText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={[styles.tabText, activeTab==='RECENT' && styles.activeTab]}>RECENT</Text>
        <Text style={styles.tabText}>MOST LIKED</Text>
        <Text style={styles.tabText}>COLLECTIONS</Text>
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
  {/* Background Image */}
  <Image
    source={require('./image.png')} // adjust path
    style={styles.emptyBgImage}
    resizeMode="cover"
  />

  {/* Overlay content */}
  <View style={styles.emptyOverlay}>
    <Text style={styles.emptyTitle}>No Images Added</Text>
    <Text style={styles.emptySub}>
      Start adding images from your camera roll to personalize profile.
    </Text>

    <TouchableOpacity style={styles.uploadBtn}>
      <Text style={styles.uploadBtnText}>Upload Image</Text>
    </TouchableOpacity>
  </View>
</View>

    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: COLORS.black}}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
     
      {isEditing ? renderEditView() : renderProfileView()}

      {/* SAVE WARNING MODAL (Screen 32 Popup) */}
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save before you leave</Text>
            <Text style={styles.modalSub}>Make sure to save before you leave so you don't lose your changes.</Text>
            
            <TouchableOpacity 
              style={styles.modalBtnLeave} 
              onPress={() => { setShowSaveModal(false); setIsEditing(false); }}
            >
              <Text style={styles.btnLeaveText}>Leave</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalBtnContinue} 
              onPress={() => setShowSaveModal(false)}
            >
              <Text style={styles.btnContinueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black, paddingHorizontal: 10 },
  
  // --- Profile View Styles ---
topLogo: {
  width: '100%',
  backgroundColor: '#11524F', // ✅ full section background
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 5,
  marginBottom: 20,
},

logoContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},

logoImage: {
  width: 150,   // adjust based on design
  height: 70,
},

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20,paddingHorizontal: 10 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, borderColor: 'white', borderWidth: 2 },
  headerText: { marginLeft: 20, flex: 1 },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Arial-BoldMT' : 'sans-serif-condensed' },
  badge: { backgroundColor: COLORS.tealAccent, paddingHorizontal: 6, paddingVertical:2, borderRadius: 4, marginLeft: 10 },
  badgeText: { fontSize: 10, fontWeight: '800' },
 stats: {
  flexDirection: 'row',
  gap: 15,
  marginTop: 8,
},

statItem: {
  // alignItems: 'center',
},

statNumber: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '800',
},

statLabel: {
  color: '#888',
  fontSize: 12,
  marginTop: 2,
    fontWeight: '800',
},
 boldWhite: { fontWeight: 'bold', color: 'white', fontSize: 16 },
  
  actionButtons: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  editButton: { flex: 1, backgroundColor: COLORS.teal, padding: 10, borderRadius: 20, alignItems: 'center' },
  settingsButton: { flex: 1, backgroundColor: '#1E1E1E', padding: 10, borderRadius: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  tabs: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10, marginBottom: 20,paddingHorizontal: 10 },
  tabText: { color: '#666', fontWeight: 'bold', fontSize: 14 },
  activeTab: { color: 'white' },
  emptyState: {
  height: 350,
  position: 'relative',
  borderRadius: 12,
  overflow: 'hidden', // 🔥 important for rounded image
},

emptyBgImage: {
  width: '100%',
  height: '100%',
},

emptyOverlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.45)', // better contrast
},

emptyTitle: {
  color: 'white',
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 6,
},

emptySub: {
  color: '#B0B0B0',
  textAlign: 'center',
  marginBottom: 22,
  width: 260,
  lineHeight: 20,
},

uploadBtn: {
  backgroundColor: COLORS.tealAccent,
  paddingHorizontal: 40,
  paddingVertical: 14,
  borderRadius: 30,
},

uploadBtnText: {
  color: 'black',
  fontWeight: '700',
  fontSize: 16,
},
  editContainer: { flex: 1, backgroundColor: COLORS.black },
  editHeader: { flexDirection: 'row',
    backgroundColor: '#11524F', 
    justifyContent: 'space-between',
     alignItems: 'center', 
     paddingHorizontal: 15,
     width: '100%',
  paddingVertical: 10,
  marginBottom: 20,
 },

  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  editScroll: { paddingHorizontal: 20 },
  avatarEditContainer: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { width: 100, height: 100, position: 'relative' },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, opacity: 0.6 },
  plusIconOverlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#333', borderRadius: 50 
  },
  
  formGroup: { marginBottom: 20 },
  label: { color: 'white', fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: COLORS.inputBg, borderRadius: 8, padding: 15, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#222' },
  iconInputContainer: { flexDirection: 'row', backgroundColor: COLORS.inputBg, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  inputIcon: { paddingLeft: 15 },
  iconInput: { flex: 1, padding: 15, color: 'white', fontSize: 14 },
  socialInputRow: { marginBottom: 15 },

  // --- Modal Styles ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#0B201E', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { color: '#CCC', textAlign: 'center', marginBottom: 25, lineHeight: 22, fontSize: 14 },
  modalBtnLeave: { backgroundColor: 'white', width: '100%', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 10 },
  btnLeaveText: { color: '#003833', fontWeight: 'bold', fontSize: 16 },
  modalBtnContinue: { backgroundColor: 'transparent', width: '100%', padding: 15, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: 'white' },
  btnContinueText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;