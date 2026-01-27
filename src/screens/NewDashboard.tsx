import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient'; // Uncomment if you have this installed

const { width } = Dimensions.get('window');

const NewDashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#022020" />
      
      {/* Ideally, use <ImageBackground> here with your star/ray texture 
        Source would be: require('./assets/background_texture.png')
      */}
      <View style={styles.backgroundContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- Header Logo Section --- */}
          <View style={styles.headerSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoTextMain}>WALL</Text>
              <Text style={[styles.logoTextMain, { fontSize: 12 }]}>IS</Text>
              <Text style={styles.logoTextMain}>WELL</Text>
              <Text style={styles.logoSub}>DESERVES A STORY</Text>
            </View>
          </View>

          {/* --- Gold Badge --- */}
          <View style={styles.badgeContainer}>
            <View style={styles.badgeBorder}>
               {/* Simulating the marquee lights with a dotted border or specific image */}
              <View style={styles.badgeInner}>
                <Text style={styles.badgeText}>ALL IN</Text>
              </View>
            </View>
          </View>

          {/* --- Status Bar --- */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="star-circle" size={16} color="#FDB931" />
              <Text style={styles.statusText}>Highest Royalties</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="star-circle" size={16} color="#FDB931" />
              <Text style={styles.statusText}>Premium Contribution</Text>
            </View>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="cog" size={16} color="#FDB931" />
              <Text style={styles.statusText}>Priority Support</Text>
            </View>
          </View>

          {/* --- 3 Action Cards --- */}
          <View style={styles.cardsContainer}>
            {/* Card 1 */}
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#101A33' }]}>
               {/* Background distinct style for card */}
              <View style={styles.cardIconCircle}>
                 <MaterialCommunityIcons name="sack" size={30} color="#6EB1F7" />
              </View>
              <Text style={styles.cardTitle}>Know your{'\n'}earnings</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FDB931" style={styles.arrowIcon} />
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#331515' }]}>
              <View style={styles.cardIconCircle}>
                 <MaterialCommunityIcons name="trophy" size={30} color="#F79E6E" />
              </View>
              <Text style={styles.cardTitle}>Current tier{'\n'}benefits</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FDB931" style={styles.arrowIcon} />
            </TouchableOpacity>

            {/* Card 3 */}
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#1A1033' }]}>
              <View style={styles.cardIconCircle}>
                 <MaterialCommunityIcons name="chart-line-variant" size={30} color="#B06EF7" />
              </View>
              <Text style={styles.cardTitle}>Track your{'\n'}growth</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FDB931" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>

          {/* --- Divider --- */}
          <View style={styles.dividerSection}>
            <MaterialCommunityIcons name="key-variant" size={20} color="#FDB931" style={{transform: [{rotate: '180deg'}]}} />
            <Text style={styles.dividerText}>FEATURED FOR YOU</Text>
            <MaterialCommunityIcons name="key-variant" size={20} color="#FDB931" />
          </View>

          {/* --- White Promo Card --- */}
          <View style={styles.promoCard}>
            <View style={styles.promoContentRow}>
              <View style={styles.promoTextCol}>
                <Text style={styles.promoTitle}>Vizag Photo Trade Show!</Text>
                <Text style={styles.promoDesc}>
                  The Biggest Photography Celebration of 2026 is coming to Vizag!
                </Text>
              </View>
              
              {/* Event Poster Image */}
              <Image 
                source={{ uri: 'https://via.placeholder.com/150x200' }} 
                style={styles.promoImage} 
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>BOOK YOUR PASS</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} /> 
          {/* Spacer for bottom tab */}
        </ScrollView>

        {/* --- Bottom Navigation Bar --- */}
        <View style={styles.bottomTabContainer}>
          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="view-dashboard" size={26} color="#FFFFFF" />
            <Text style={[styles.tabText, { color: '#FFFFFF' }]}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="image-multiple" size={24} color="#555" />
            <Text style={styles.tabText}>Collections</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="message-text" size={24} color="#555" />
            <Text style={styles.tabText}>Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="wallet" size={24} color="#555" />
            <Text style={styles.tabText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="account" size={24} color="#555" />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022020', // Dark teal fallback
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#032A2A', // Main background color
    // Add gradients here if library available
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  
  // --- Header ---
  headerSection: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
    alignItems: 'center',
    width: 120,
  },
  logoTextMain: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 24,
    textAlign: 'center',
  },
  logoSub: {
    color: '#fff',
    fontSize: 6,
    marginTop: 2,
    letterSpacing: 1,
  },

  // --- Badge ---
  badgeContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBorder: {
    backgroundColor: '#000',
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FDB931', // Gold
    width: width * 0.7,
    alignItems: 'center',
    // Shadow for glow effect
    shadowColor: "#FDB931",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  badgeInner: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#554000',
    borderRadius: 40,
    borderStyle: 'dashed', // Simulating lights
  },
  badgeText: {
    color: '#FDB931',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(253, 185, 49, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // --- Status Bar ---
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    gap: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#FDB931',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '600',
  },

  // --- Action Cards ---
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  actionCard: {
    width: '31%',
    aspectRatio: 0.8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIconCircle: {
    marginTop: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  arrowIcon: {
    alignSelf: 'flex-end',
  },

  // --- Divider ---
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerText: {
    color: '#FDB931',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // --- Promo Card ---
  promoCard: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },
  promoContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  promoTextCol: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#023333', // Dark Teal
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  promoImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#104F55', // Dark teal button
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // --- Bottom Tab ---
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20, // Adjust for iPhone X home bar
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#555',
    fontSize: 10,
    marginTop: 4,
  },
});

export default NewDashboardScreen;
