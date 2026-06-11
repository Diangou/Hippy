const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
]

// Bounding box France métropolitaine, 100 résultats max, timeout serveur 25s
const QUERY = `[out:json][timeout:25];
(
  node["tourism"="camp_site"]["name"](42,-5,51,9);
  node["leisure"="picnic_site"]["name"](42,-5,51,9);
);
out 100 body;`

async function fetchWithTimeout(url, options, ms = 20000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const resp = await fetch(url, { ...options, signal: ctrl.signal })
    clearTimeout(timer)
    return resp
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

async function queryMirrors() {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(QUERY),
  }
  let lastErr
  for (const url of MIRRORS) {
    try {
      const resp = await fetchWithTimeout(url, options, 20000)
      if (resp.ok) return resp.json()
      lastErr = new Error(`HTTP ${resp.status} on ${url}`)
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr
}

function deriveStatus(tags) {
  if (tags.tourism === 'camp_site') return 'allowed'
  return 'conditional'
}

function deriveWeather(lat) {
  const nightTemp = lat > 47 ? 8 : lat > 44 ? 12 : 16
  const precipitation = lat > 47 ? 2.1 : lat > 44 ? 1.4 : 0.8
  const comfort = nightTemp < 10 ? 'Frais' : nightTemp < 14 ? 'Agréable' : 'Confortable'
  return { nightTemp, precipitation, comfort }
}

function deriveScore(status, lat) {
  const reg = status === 'allowed' ? 50 : 30
  const tempPts = lat > 47 ? 14 : lat > 44 ? 20 : 22
  const rainPts = lat > 47 ? 10 : 14
  return {
    total: reg + tempPts + rainPts,
    components: [
      { label: 'Réglementation', weight: 50, points: reg,     max: 50 },
      { label: 'Température',    weight: 25, points: tempPts, max: 25 },
      { label: 'Précipitations', weight: 25, points: rainPts, max: 25 },
    ],
  }
}

export async function fetchOverpassSpots() {
  const json = await queryMirrors()

  return json.elements
    .filter((el) => el.tags?.name)
    .slice(0, 100)
    .map((el) => {
      const tags = el.tags
      const status = deriveStatus(tags)
      const location =
        tags['addr:city'] ||
        tags['addr:municipality'] ||
        tags['operator'] ||
        'France'
      return {
        id: el.id,
        name: tags.name,
        location,
        lat: el.lat,
        lng: el.lon,
        status,
        weather: deriveWeather(el.lat),
        score: deriveScore(status, el.lat),
      }
    })
}
