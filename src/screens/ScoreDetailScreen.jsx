import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { spots } from '../data/spots'

function barColor(ratio) {
  if (ratio >= 0.75) return '#2E7D32'
  if (ratio >= 0.5) return '#E65100'
  return '#C62828'
}

function ScoreRow({ component }) {
  const ratio = component.points / component.max
  const color = barColor(ratio)
  const pct = Math.round(ratio * 100)

  return (
    <View style={styles.rowWrap}>
      <View style={styles.rowHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Text style={styles.rowLabel}>{component.label}</Text>
          <Text style={styles.rowWeight}>{component.weight}%</Text>
        </View>
        <Text style={[styles.rowScore, { color }]}>
          {component.points}/{component.max}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${pct}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  )
}

export default function ScoreDetailScreen() {
  const navigation = useNavigation()
  const { params } = useRoute()
  const spot = spots.find((s) => s.id === params?.spotId)

  if (!spot) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ color: '#6B7280' }}>Spot introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#2E7D32', fontWeight: '600' }}>← Retour</Text>
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
          <Text style={styles.logo}>🌿 Hippy</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Card title */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Détail du score</Text>
            <Text style={styles.cardSpot} numberOfLines={1}>{spot.name}</Text>
          </View>

          {/* Global score */}
          <View style={styles.globalRow}>
            <Text style={styles.globalLabel}>Score global</Text>
            <View style={styles.globalScoreBlock}>
              <Text style={[styles.globalScore, { color: totalColor }]}>
                {spot.score.total}
              </Text>
              <Text style={styles.globalMax}>/100</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Criteria */}
          <View style={styles.criteriaBlock}>
            <Text style={styles.criteriaTitle}>DÉTAIL PAR CRITÈRE</Text>
            {spot.score.components.map((c) => (
              <ScoreRow key={c.label} component={c} />
            ))}
          </View>
        </View>

        {/* Footer disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Ces informations sont données à titre indicatif. Vérifiez toujours auprès des autorités locales.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    ...Platform.select({ android: { paddingTop: 32 } }),
  },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  scrollContent: {
    paddingBottom: 48,
  },

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
  backBtn: { paddingRight: 16, paddingVertical: 4 },
  backText: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },
  logo: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cardSpot: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  globalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  globalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  globalScoreBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  globalScore: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
  },
  globalMax: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },

  criteriaBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },
  criteriaTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#9CA3AF',
  },

  rowWrap: { gap: 6 },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  rowWeight: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rowScore: {
    fontSize: 15,
    fontWeight: '800',
  },
  track: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 5,
  },

  disclaimer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
})
