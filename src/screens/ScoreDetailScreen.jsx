import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

function barColor(ratio) {
  if (ratio >= 0.75) return '#00C853'
  if (ratio >= 0.5)  return '#FF8F00'
  return '#F50057'
}

function ScoreRow({ component }) {
  const unavailable = component.points === null
  const ratio = unavailable ? 0 : component.points / component.max
  const color = unavailable ? '#BBCCBB' : barColor(ratio)
  const pct   = unavailable ? 0 : Math.round(ratio * 100)

  return (
    <View style={styles.rowWrap}>
      <View style={styles.rowHeader}>
        <View style={{ gap: 2 }}>
          <Text style={styles.rowLabel}>{component.label}</Text>
          <Text style={styles.rowWeight}>{component.weight}% du score</Text>
        </View>
        <Text style={[styles.rowScore, { color }]}>
          {unavailable ? '–' : component.points}
          <Text style={styles.rowMax}>/{component.max}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        {!unavailable && (
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
        )}
      </View>
    </View>
  )
}

export default function ScoreDetailScreen() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const spot = params?.spot

  if (!spot) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ color: '#9CA3AF' }}>Spot introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#00C853', fontWeight: '700' }}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const totalColor = barColor(spot.score.total / 100)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Spot</Text>
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <View style={styles.logoAccent} />
            <Text style={styles.logo}>Hippy</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={[styles.hero, { borderTopColor: totalColor }]}>
          <Text style={styles.heroLabel}>SCORE GLOBAL</Text>
          <View style={styles.heroScoreRow}>
            <Text style={[styles.heroScore, { color: totalColor }]}>{spot.score.total}</Text>
            <Text style={styles.heroMax}>/100</Text>
          </View>
          <Text style={styles.heroSpot} numberOfLines={1}>{spot.name}</Text>
          <View style={styles.heroBar}>
            <View style={[styles.heroFill, { width: `${spot.score.total}%`, backgroundColor: totalColor }]} />
          </View>
        </View>

        {/* Criteria */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DÉTAIL PAR CRITÈRE</Text>
          {spot.score.components.map((c) => (
            <ScoreRow key={c.label} component={c} />
          ))}
        </View>

        {/* Score legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>SEUILS DE SCORE</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#00C853' }]} />
            <Text style={styles.legendText}><Text style={styles.legendBold}>≥ 65</Text> — Autorisé</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#FF8F00' }]} />
            <Text style={styles.legendText}><Text style={styles.legendBold}>40 – 64</Text> — Conditionnel</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#F50057' }]} />
            <Text style={styles.legendText}><Text style={styles.legendBold}>{"< 40"}</Text> — Interdit</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Informations indicatives. Vérifiez auprès des autorités locales avant tout bivouac.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: '#F8FAF8',
    ...Platform.select({ android: { paddingTop: 32 } }),
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#F8FAF8' },
  scrollContent: { paddingBottom: 56 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F0F4F1',
  },
  backBtn: { paddingRight: 16, paddingVertical: 4 },
  backText: { fontSize: 14, color: '#00A846', fontWeight: '700' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoAccent: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C853' },
  logo: { fontSize: 18, fontWeight: '900', color: '#0D1F0D', letterSpacing: -0.5 },

  hero: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 24, gap: 4,
    borderTopWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  heroLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#BBCCBB' },
  heroScoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 4 },
  heroScore: { fontSize: 72, fontWeight: '900', lineHeight: 76, letterSpacing: -2 },
  heroMax: { fontSize: 22, fontWeight: '700', color: '#BBCCBB', paddingBottom: 10 },
  heroSpot: { fontSize: 13, color: '#8AAA8A', fontWeight: '600', marginBottom: 12 },
  heroBar: { height: 5, backgroundColor: '#F0F4F1', borderRadius: 3, overflow: 'hidden' },
  heroFill: { height: 5, borderRadius: 3 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 20, padding: 20, gap: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#BBCCBB' },

  rowWrap: { gap: 8 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowLabel: { fontSize: 15, fontWeight: '700', color: '#1A2E1A' },
  rowWeight: { fontSize: 11, color: '#AABCAA', fontWeight: '500' },
  rowScore: { fontSize: 20, fontWeight: '900', lineHeight: 24 },
  rowMax: { fontSize: 13, fontWeight: '600', color: '#BBCCBB' },
  track: { height: 6, backgroundColor: '#F0F4F1', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },

  legend: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 20, padding: 20, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  legendTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#BBCCBB', marginBottom: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 13, color: '#4A6A4A' },
  legendBold: { fontWeight: '800' },

  disclaimer: {
    marginHorizontal: 16, marginTop: 12,
    padding: 16, borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#F0F4F1',
  },
  disclaimerText: { fontSize: 11, color: '#AABCAA', textAlign: 'center', lineHeight: 17 },
})
