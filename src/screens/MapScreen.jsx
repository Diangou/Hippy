import {
  View, Text, StyleSheet, SafeAreaView, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { statusConfig } from '../data/spots'
import { buildMainMapHtml } from '../utils/mapHtml'
import LeafletView from '../components/LeafletView'

const MAP_HTML = buildMainMapHtml()

export default function MapScreen() {
  const navigation = useNavigation()
  function handleMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'navigate' && data.id) {
        navigation.navigate('SpotDetail', { spotId: data.id })
      }
    } catch (_) {}
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <SafeAreaView style={styles.navSafe}>
        <View style={styles.navbar}>
          <Text style={styles.logo}>🌿 Hippy</Text>
          <Text style={styles.tagline}>Bivouaquer en toute sérénité</Text>
        </View>
      </SafeAreaView>

      {/* Map */}
      <LeafletView html={MAP_HTML} onMessage={handleMessage} />

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <View key={key} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: cfg.color }]} />
            <Text style={styles.legendText}>{cfg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navSafe: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
    ...Platform.select({
      android: { paddingTop: 32 },
    }),
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
})
