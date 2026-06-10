import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { spots, statusConfig } from '../data/spots'
import { buildSpotMapHtml } from '../utils/mapHtml'
import ScoreGauge from '../components/ScoreGauge'
import LeafletView from '../components/LeafletView'

export default function SpotDetailScreen() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const spot = spots.find((s) => s.id === params?.spotId)

  if (!spot) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Spot introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const cfg = statusConfig[spot.status]
  const mapHtml = buildSpotMapHtml(spot)

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Carte</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>🌿 Hippy</Text>
      </View>

      {/* Mini map — fixed height, outside ScrollView */}
      <View style={styles.mapContainer}>
        <LeafletView html={mapHtml} />
      </View>

      {/* Scrollable detail */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.spotName}>{spot.name}</Text>
          <Text style={styles.location}>{spot.location}</Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Weather */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MÉTÉO CETTE NUIT</Text>
          <WeatherRow icon="🌡" label="Température nocturne" value={`${spot.weather.nightTemp}°C`} />
          <WeatherRow icon="🌧" label="Précipitations" value={`${spot.weather.precipitation} mm`} />
          <WeatherRow icon="✅" label="Confort" value={spot.weather.comfort} />
        </View>

        <View style={styles.divider} />

        {/* Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SCORE HIPPY</Text>
          <View style={styles.gaugeRow}>
            <ScoreGauge score={spot.score.total} />
          </View>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => navigation.navigate('ScoreDetail', { spotId: spot.id })}
          >
            <Text style={styles.detailBtnText}>Voir le détail du score →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function WeatherRow({ icon, label, value }) {
  return (
    <View style={styles.weatherRow}>
      <Text style={styles.weatherIcon}>{icon}</Text>
      <Text style={styles.weatherLabel}>{label}</Text>
      <Text style={styles.weatherValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({ android: { paddingTop: 32 } }),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: { fontSize: 16, color: '#6B7280' },
  link: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  backBtn: { paddingVertical: 4, paddingRight: 16 },
  backText: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },
  logo: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },

  mapContainer: {
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 4,
  },
  spotName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#9CA3AF',
  },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weatherIcon: { fontSize: 18 },
  weatherLabel: { flex: 1, fontSize: 14, color: '#374151' },
  weatherValue: { fontSize: 14, fontWeight: '700', color: '#111827' },

  gaugeRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  detailBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  detailBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
})
