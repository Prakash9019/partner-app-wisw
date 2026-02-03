import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, 
  Image, TextInput, ScrollView, Dimensions, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS } from '../../utils/theme';
// import client from '../../api/client'; // Your API Client

const { height } = Dimensions.get('window');

const CollectionsScreen = () => {
  // --- STATE MANAGEMENT ---
  // Flow: 'list' -> 'upload_modal' -> 'select_collection' -> 'fill_details' -> 'success'
  const [viewState, setViewState] = useState<'list' | 'select_collection' | 'fill_details' | 'success'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'CREATED' | 'PENDING' | 'DISCARDED'>('CREATED');
  
  // Data State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState('');
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [metaData, setMetaData] = useState({
    title: '', description: '', location: '', visualStyle: '', tags: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock Existing Collections for Dropdown
  const existingCollections = ['Colorful Patterns', 'Street Life', 'Monochrome'];

  // --- HANDLERS ---

  // 1. Pick Image (Starts the flow)
  const pickImage = async () => {
    // Close modal first
    setShowUploadModal(false);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setViewState('select_collection'); // Move to next screen
    }
  };

  // 2. Submit to Backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('collectionName', collectionName);
      formData.append('title', metaData.title);
      formData.append('description', metaData.description);
      formData.append('locationClicked', metaData.location);
      formData.append('visualStyle', metaData.visualStyle);
      formData.append('tags', metaData.tags);

      // Append Image
      if (selectedImage) {
        const filename = selectedImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        // @ts-ignore
        formData.append('image', { uri: selectedImage, name: filename, type });
      }

      // API Call (Uncomment when ready)
      // await client.post('/collections', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // Mock Success
      setTimeout(() => {
        setLoading(false);
        setViewState('success');
      }, 1500);

    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to upload collection.");
    }
  };

  const resetFlow = () => {
    setViewState('list');
    setSelectedImage(null);
    setMetaData({ title: '', description: '', location: '', visualStyle: '', tags: '' });
    setCollectionName('');
    setActiveTab('PENDING'); // Switch to pending tab to show "new" item logic
  };

  // --- RENDERERS ---

  // SCREEN 1: SELECT COLLECTION (Image 15)
  const renderSelectCollection = () => (
    <View style={styles.wizardContainer}>
      <View style={styles.wizardHeader}>
        <TouchableOpacity onPress={() => setViewState('list')}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.wizardTitle}>Create</Text>
        <View style={{width: 24}} />
      </View>
      
      <View style={styles.previewContainer}>
        <Image source={{ uri: selectedImage! }} style={styles.previewImage} resizeMode="cover" />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Choose Collection Name</Text>
        
        {/* Toggle between Existing Dropdown and New Input */}
        {!isNewCollection ? (
          <View>
            <TouchableOpacity style={styles.dropdown} onPress={() => setIsNewCollection(true)}>
              <Text style={{color: collectionName ? 'white' : '#888'}}>
                {collectionName || "Select from existing..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {/* Mock Dropdown Items (Simplified) */}
            <View style={{marginTop: 10}}>
               {existingCollections.map(c => (
                 <TouchableOpacity key={c} onPress={() => setCollectionName(c)} style={{padding: 10}}>
                    <Text style={{color: '#AAA'}}>{c}</Text>
                 </TouchableOpacity>
               ))}
               <TouchableOpacity onPress={() => setIsNewCollection(true)} style={{padding: 10}}>
                  <Text style={{color: COLORS.primary}}>+ Create New Collection</Text>
               </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
             <TextInput 
                style={styles.input} 
                placeholder="Enter New Collection Name" 
                placeholderTextColor="#666"
                value={collectionName}
                onChangeText={setCollectionName}
             />
             <TouchableOpacity onPress={() => setIsNewCollection(false)}>
                <Text style={{color: '#888', marginTop: 5, fontSize: 12}}>Cancel, select existing</Text>
             </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.nextButton, !collectionName && {opacity: 0.5}]} 
        disabled={!collectionName}
        onPress={() => setViewState('fill_details')}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  // SCREEN 2: FILL DETAILS (Image 17)
  const renderFillDetails = () => (
    <View style={styles.wizardContainer}>
      <View style={styles.wizardHeader}>
        <TouchableOpacity onPress={() => setViewState('select_collection')}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.wizardTitle}>Filling Details</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
           {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.headerAction}>Done</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name of the Image</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Sunset in Jaipur" 
            placeholderTextColor="#666"
            value={metaData.title}
            onChangeText={(t) => setMetaData({...metaData, title: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]} 
            placeholder="Describe the image..." 
            placeholderTextColor="#666"
            multiline
            value={metaData.description}
            onChangeText={(t) => setMetaData({...metaData, description: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image Clicked At</Text>
          <TextInput 
            style={styles.input} 
            placeholder="City, Country" 
            placeholderTextColor="#666"
            value={metaData.location}
            onChangeText={(t) => setMetaData({...metaData, location: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visual Style</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Minimalist, Abstract" 
            placeholderTextColor="#666"
            value={metaData.visualStyle}
            onChangeText={(t) => setMetaData({...metaData, visualStyle: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Comma separated tags" 
            placeholderTextColor="#666"
            value={metaData.tags}
            onChangeText={(t) => setMetaData({...metaData, tags: t})}
          />
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.nextButtonText}>{loading ? "Submitting..." : "Submit"}</Text>
      </TouchableOpacity>
    </View>
  );

  // SCREEN 3: SUCCESS (Image 18)
  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIconCircle}>
        <FontAwesome5 name="hourglass-start" size={50} color="white" />
      </View>
      <Text style={styles.successText}>
        Your creation has been submitted and is waiting for approval. You will be notified shortly once it's approved.
      </Text>
      <TouchableOpacity style={styles.trackButton} onPress={resetFlow}>
        <Text style={styles.trackButtonText}>Track Approval</Text>
      </TouchableOpacity>
    </View>
  );

  // SCREEN 0: MAIN LIST (Image 19)
  const renderList = () => (
    <View style={styles.listContainer}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['CREATED', 'PENDING', 'DISCARDED'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listScroll}>
        {/* Mock Content based on Tab */}
        {activeTab === 'PENDING' ? (
           // Pending Item Example
           <View style={styles.card}>
             <View style={styles.cardImagePlaceholder}><Text style={{color:'#555'}}>Img</Text></View>
             <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Colorful Patterns</Text>
                <Text style={styles.cardSub}>1 Image • Submitted Just Now</Text>
                <View style={styles.statusBadge}>
                   <Text style={styles.statusText}>Waiting Approval</Text>
                </View>
             </View>
           </View>
        ) : (
           // Empty State for others
           <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>No collections found.</Text>
             <TouchableOpacity style={styles.createButton} onPress={() => setShowUploadModal(true)}>
               <Text style={styles.createButtonText}>Create New Collection</Text>
             </TouchableOpacity>
           </View>
        )}
      </ScrollView>

      {/* FAB */}
      {activeTab !== 'PENDING' && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowUploadModal(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  // --- MAIN RENDER ---
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {viewState === 'list' && renderList()}
      {viewState === 'select_collection' && renderSelectCollection()}
      {viewState === 'fill_details' && renderFillDetails()}
      {viewState === 'success' && renderSuccess()}

      {/* UPLOAD MODAL */}
      <Modal visible={showUploadModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowUploadModal(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setShowUploadModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose the option to create{'\n'}new collection</Text>
            
            <TouchableOpacity style={styles.modalBtnWhite} onPress={pickImage}>
              <Text style={styles.modalBtnTextDark}>Upload Single Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalBtnOutline}>
              <Text style={styles.modalBtnTextWhite}>Bulk Upload</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // WIZARD STYLES
  wizardContainer: { flex: 1, padding: 20 },
  wizardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  wizardTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerAction: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  
  previewContainer: { height: 300, backgroundColor: '#1A1A1A', borderRadius: 20, marginBottom: 30, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  
  formSection: { flex: 1 },
  scrollForm: { paddingBottom: 100 },
  inputGroup: { marginBottom: 20 },
  label: { color: 'white', marginBottom: 10, fontSize: 16, fontWeight: '600' },
  dropdown: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' },
  input: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, color: 'white' },
  
  nextButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // SUCCESS SCREEN
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  successText: { color: 'white', textAlign: 'center', fontSize: 16, lineHeight: 24, marginBottom: 40 },
  trackButton: { backgroundColor: '#1A1A1A', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, borderWidth: 1, borderColor: COLORS.primary },
  trackButtonText: { color: COLORS.primary, fontWeight: 'bold' },

  // LIST STYLES
  listContainer: { flex: 1 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', backgroundColor: '#13514E',paddingTop:30 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#fff' },
  tabText: { color: '#666', fontWeight: 'bold' },
  activeTabText: { color: 'white' },
  listScroll: { flex: 1, padding: 20 },
  
  // Card
  card: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 12, padding: 12, marginBottom: 15 },
  cardImagePlaceholder: { width: 70, height: 70, backgroundColor: '#222', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardContent: { marginLeft: 15, justifyContent: 'center' },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cardSub: { color: '#666', fontSize: 12, marginTop: 4 },
  statusBadge: { backgroundColor: 'rgba(17, 82, 79, 0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginTop: 8 },
  statusText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: 'white', fontSize: 18, marginBottom: 20 },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30 },
  createButtonText: { color: 'white', fontWeight: 'bold' },
  
  // FAB
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#104F49', borderRadius: 20, padding: 25, alignItems: 'center' },
  closeIcon: { position: 'absolute', top: 15, left: 15 },
  modalTitle: { color: 'white', fontSize: 18, textAlign: 'left', marginTop: 20, marginBottom: 30, fontWeight: '600' },
  modalBtnWhite: { backgroundColor: 'white', width: '100%', padding: 16, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  modalBtnTextDark: { color: '#003833', fontWeight: '800',fontSize: 16 },
  modalBtnOutline: { borderWidth: 1, borderColor: 'white', width: '100%', padding: 16, borderRadius: 30, alignItems: 'center' },
  modalBtnTextWhite: { color: 'white', fontWeight: '800',fontSize: 16 },
});

export default CollectionsScreen;