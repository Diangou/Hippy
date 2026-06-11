const BASE = 'https://api.open-meteo.com/v1/forecast'

function comfort(temp) {
  if (temp >= 15) return 'Agréable'
  if (temp >= 9)  return 'Confortable'
  if (temp >= 4)  return 'Frais'
  return 'Difficile'
}

export async function fetchWeather(lat, lng) {
  const url =
    `${BASE}?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_min,precipitation_sum` +
    `&timezone=Europe%2FParis&forecast_days=1`

  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Weather ${resp.status}`)
  const json = await resp.json()

  const nightTemp   = Math.round(json.daily.temperature_2m_min[0])
  const precipitation = Math.round((json.daily.precipitation_sum[0] ?? 0) * 10) / 10

  return { nightTemp, precipitation, comfort: comfort(nightTemp) }
}
