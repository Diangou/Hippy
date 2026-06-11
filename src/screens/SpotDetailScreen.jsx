import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { statusConfig } from '../data/spots'
import { buildSpotMapHtml } from '../utils/mapHtml'
import ScoreGauge from '../components/ScoreGauge'
import LeafletView from '../components/LeafletView'

export default function SpotDetailScreen() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const spot = params?.spot

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
        <View style={styles.logoWrap}>
          <View style={styles.logoAccent} />
          <Text style={styles.logo}>Hippy</Text>
        </View>
      </View>

      {/* Mini map */}
      <View style={styles.mapContainer}>
        <LeafletView html={mapHtml} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Title */}
        <View style={styles.titleBlock}>
          <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <View style={[styles.badgeDot, { backgroundColor: cfg.color }]} />
            <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label.toUpperCase()}</Text>
          </View>
          <Text style={styles.spotName}>{spot.name}</Text>
          <Text style={styles.location}>{spot.location}</Text>
        </View>

        <View style={styles.divider} />

        {/* Weather */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MÉTÉO CE SOIR</Text>
          <View style={styles.weatherGrid}>
            <WeatherCard icon="🌡" label="Température" value={`${spot.weather.nightTemp}°C`} />
            <WeatherCard icon="🌧" label="Précipitations" value={`${spot.weather.precipitation} mm`} />
            <WeatherCard icon="✦" label="Confort" value={spot.weather.comfort} small />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Score */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SCORE HIPPY</Text>
          <View style={styles.gaugeWrap}>
            <ScoreGauge score={spot.score.total} />
          </View>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => navigation.navigate('ScoreDetail', { spot })}
            activeOpacity={0.8}
          >
            <Text style={styles.detailBtnText}>Voir le détail du score →</Text>
          </TouchableOpacity>
        </View>

        {/* Bivouacs communautaires */}
        {spot.bivouacs?.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BIVOUACS À PROXIMITÉ</Text>
              <Text style={styles.sectionSub}>Source : refuges.info</Text>
              {spot.bivouacs.map((b, i) => (
                <BivouacRow key={i} bivouac={b} />
              ))}
            </View>
          </>
        )}

        {spot.bivouacs?.length === 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BIVOUACS À PROXIMITÉ</Text>
              <Text style={styles.emptyText}>Aucun bivouac communautaire recensé dans un rayon de 30 km.</Text>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

function WeatherCard({ icon, label, value, small }) {
  return (
    <View style={styles.weatherCard}>
      <Text style={styles.weatherIcon}>{icon}</Text>
      <Text style={styles.weatherValue} numberOfLines={1}>{value}</Text>
      <Text style={[styles.weatherLabel, small && { fontSize: 9 }]} numberOfLines={1}>{label}</Text>
    </View>
  )
}

function BivouacRow({ bivouac }) {
  return (
    <View style={styles.bivouacRow}>
      <View style={styles.bivouacIcon}>
        <Text style={styles.bivouacIconText}>⛺</Text>
      </View>
      <View style={styles.bivouacInfo}>
        <Text style={styles.bivouacName} numberOfLines={1}>{bivouac.name}</Text>
        <Text style={styles.bivouacDist}>{bivouac.distance} km</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: '#fff',
    ...Platform.select({ android: { paddingTop: 32 } }),
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#fff' },
  errorText: { fontSize: 15, color: '#9CA3AF' },
  link: { fontSize: 14, color: '#00C853', fontWeight: '700' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F4F1', backgroundColor: '#fff',
  },
  backBtn: { paddingRight: 16, paddingVertical: 4 },
  backText: { fontSize: 14, color: '#00A846', fontWeight: '700' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoAccent: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C853' },
  logo: { fontSize: 18, fontWeight: '900', color: '#0D1F0D', letterSpacing: -0.5 },

  mapContainer: { height: 220, borderBottomWidth: 1, borderBottomColor: '#F0F4F1' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  titleBlock: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 4, gap: 8 },
  badge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginBottom: 2,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  spotName: { fontSize: 22, fontWeight: '900', color: '#0D1F0D', letterSpacing: -0.3, lineHeight: 28 },
  location: { fontSize: 13, color: '#8AAA8A', fontWeight: '500' },

  divider: { height: 1, backgroundColor: '#F5F8F5', marginHorizontal: 20, marginTop: 20 },

  section: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#BBCCBB' },
  sectionSub: { fontSize: 11, color: '#BBCCBB', fontWeight: '500', marginTop: -8 },

  weatherGrid: { flexDirection: 'row', gap: 10 },
  weatherCard: {
    flex: 1, backgroundColor: '#FAFCFA',
    borderWidth: 1, borderColor: '#EEF3EE', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', gap: 6,
  },
  weatherIcon: { fontSize: 20 },
  weatherValue: { fontSize: 15, fontWeight: '800', color: '#0D1F0D', letterSpacing: -0.3 },
  weatherLabel: { fontSize: 10, color: '#AABCAA', fontWeight: '600', textAlign: 'center' },

  gaugeWrap: { alignItems: 'center', paddingVertical: 8 },
  detailBtn: {
    backgroundColor: '#00C853', borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#00C853', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  detailBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },

  bivouacRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FAFCFA', borderWidth: 1, borderColor: '#EEF3EE',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
  },
  bivouacIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EDFFF5', alignItems: 'center', justifyContent: 'center',
  },
  bivouacIconText: { fontSize: 18 },
  bivouacInfo: { flex: 1 },
  bivouacName: { fontSize: 14, fontWeight: '700', color: '#0D1F0D' },
  bivouacDist: { fontSize: 12, color: '#8AAA8A', fontWeight: '500', marginTop: 2 },

  emptyText: { fontSize: 13, color: '#AABCAA', fontStyle: 'italic', lineHeight: 20 },
})
