import { useState, useRef } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView, Platform,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { statusConfig } from '../data/spots'
import { buildMainMapHtml } from '../utils/mapHtml'
import { fetchWeather } from '../services/weatherService'
import { fetchProtection } from '../services/protectedAreasService'
import { fetchNearbyBivouacs } from '../services/refugesService'
import { computeScore } from '../utils/scoreUtils'
import LeafletView from '../components/LeafletView'

const MAP_HTML = buildMainMapHtml()

export default function MapScreen() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const webviewRef = useRef(null)

  async function handleMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type !== 'tap') return

      const { lat, lng } = data
      setLoading(true)
      setError(null)

      const [weather, protection, bivouacs] = await Promise.all([
        fetchWeather(lat, lng),
        fetchProtection(lat, lng),
        fetchNearbyBivouacs(lat, lng),
      ])

      const { status, zoneName } = protection
      const score = computeScore(status, weather)

      const spot = {
        id: `${lat.toFixed(5)}_${lng.toFixed(5)}`,
        name: zoneName ?? `Bivouac ${lat.toFixed(3)}° N, ${Math.abs(lng).toFixed(3)}° ${lng >= 0 ? 'E' : 'O'}`,
        location: zoneName ? `Zone protégée — ${zoneName}` : 'France',
        lat,
        lng,
        status,
        weather,
        score,
        bivouacs,
      }

      setLoading(false)
      navigation.navigate('SpotDetail', { spot })
    } catch (e) {
      setLoading(false)
      setError('Analyse impossible. Vérifiez votre connexion.')
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.navSafe}>
        <View style={styles.navbar}>
          <View style={styles.logoWrap}>
            <View style={styles.logoAccent} />
            <Text style={styles.logo}>Hippy</Text>
          </View>
          <Text style={styles.tagline}>Analysez n'importe quel point</Text>
        </View>
      </SafeAreaView>

      <LeafletView
        ref={webviewRef}
        html={MAP_HTML}
        onMessage={handleMessage}
      />

      {/* Loading overlay */}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color="#00C853" />
            <Text style={styles.overlayTitle}>Analyse en cours…</Text>
            <Text style={styles.overlayLine}>🛡 Zones protégées (INPN)</Text>
            <Text style={styles.overlayLine}>🌤 Météo nocturne (Open-Meteo)</Text>
            <Text style={styles.overlayLine}>⛺ Bivouacs proches (refuges.info)</Text>
          </View>
        </View>
      )}

      {/* Error toast */}
      {error && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{error}</Text>
        </View>
      )}

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
  container: { flex: 1, backgroundColor: '#fff' },

  navSafe: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F1',
    ...Platform.select({ android: { paddingTop: 32 } }),
  },
  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoAccent: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C853' },
  logo: { fontSize: 22, fontWeight: '900', color: '#0D1F0D', letterSpacing: -0.5 },
  tagline: { fontSize: 12, color: '#8AAA8A', fontWeight: '500' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center', alignItems: 'center', zIndex: 20,
  },
  overlayCard: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 32, paddingVertical: 28,
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10, shadowRadius: 24, elevation: 10,
    borderWidth: 1, borderColor: '#F0F4F1',
    minWidth: 240,
  },
  overlayTitle: { fontSize: 16, fontWeight: '800', color: '#0D1F0D', marginTop: 4 },
  overlayLine: { fontSize: 13, color: '#6B8A6B', fontWeight: '500' },

  toast: {
    position: 'absolute', bottom: 90, left: 20, right: 20, zIndex: 30,
    backgroundColor: '#FF3B30', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '700', textAlign: 'center' },

  legend: {
    position: 'absolute', bottom: 24, left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    gap: 8, borderWidth: 1, borderColor: '#F0F4F1',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#4A6A4A', fontWeight: '600' },
})
