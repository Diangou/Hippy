const BASE = 'https://api.open-meteo.com/v1/forecast'

function comfort(temp) {
  if (temp >= 15) return 'Agréable'
  if (temp >= 9)  return 'Confortable'
  if (temp >= 4)  return 'Frais'
  return 'Difficile'
}

async function tryFetch(url) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), 8000)
  try {
    const r = await fetch(url, { signal: ctrl.signal })
    clearTimeout(id)
    return r
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

// Retourne null si inaccessible plutôt que de throw
export async function fetchWeather(lat, lng) {
  const url =
    `${BASE}?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_min,precipitation_sum` +
    `&timezone=Europe%2FParis&forecast_days=1`

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 800))
      const resp = await tryFetch(url)
      if (!resp.ok) continue
      const json = await resp.json()
      const nightTemp     = Math.round(json.daily.temperature_2m_min[0])
      const precipitation = Math.round((json.daily.precipitation_sum[0] ?? 0) * 10) / 10
      return { nightTemp, precipitation, comfort: comfort(nightTemp) }
    } catch (_) {
      // retry silencieux
    }
  }
  return null
}
