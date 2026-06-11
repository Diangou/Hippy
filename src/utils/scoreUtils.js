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

export function computeScore(status, weather) {
  const reg     = status === 'allowed' ? 50 : status === 'conditional' ? 30 : 10
  const tempPts = tempScore(weather.nightTemp)
  const rainPts = rainScore(weather.precipitation)
  return {
    total: reg + tempPts + rainPts,
    components: [
      { label: 'Réglementation', weight: 50, points: reg,     max: 50 },
      { label: 'Température',    weight: 25, points: tempPts, max: 25 },
      { label: 'Précipitations', weight: 25, points: rainPts, max: 25 },
    ],
  }
}
