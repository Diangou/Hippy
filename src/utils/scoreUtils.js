function tempScore(t) {
  if (t >= 15) return 25
  if (t >= 10) return 20
  if (t >= 5)  return 14
  if (t >= 0)  return 8
  return 4
}

function rainScore(mm) {
  if (mm === 0) return 25
  if (mm < 1)   return 20
  if (mm < 3)   return 14
  if (mm < 6)   return 8
  return 4
}

// Seuils : ≥ 65 → autorisé, 40–64 → conditionnel, < 40 → interdit
function derivedStatus(total) {
  if (total >= 65) return 'allowed'
  if (total >= 40) return 'conditional'
  return 'forbidden'
}

export function computeScore(protectionStatus, weather) {
  const reg = protectionStatus === 'allowed' ? 50
            : protectionStatus === 'conditional' ? 30
            : 10

  if (!weather) {
    // Météo indisponible : on normalise sur 100 (reg seule, ×2)
    // → autorisé = 100, conditionnel = 60, interdit = 20
    const total = reg * 2
    return {
      total,
      status: derivedStatus(total),
      weatherAvailable: false,
      components: [
        { label: 'Réglementation', weight: 50, points: reg,  max: 50 },
        { label: 'Température',    weight: 25, points: null, max: 25 },
        { label: 'Précipitations', weight: 25, points: null, max: 25 },
      ],
    }
  }

  const tempPts = tempScore(weather.nightTemp)
  const rainPts = rainScore(weather.precipitation)
  const total   = reg + tempPts + rainPts
  return {
    total,
    status: derivedStatus(total),
    weatherAvailable: true,
    components: [
      { label: 'Réglementation', weight: 50, points: reg,     max: 50 },
      { label: 'Température',    weight: 25, points: tempPts, max: 25 },
      { label: 'Précipitations', weight: 25, points: rainPts, max: 25 },
    ],
  }
}
