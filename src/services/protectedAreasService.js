const MIRRORS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
]

async function post(url, body, ms = 12000) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: ctrl.signal,
    })
    clearTimeout(id)
    return r
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

function raceOverpass(body) {
  return new Promise((resolve) => {
    let done = false
    let failures = 0

    MIRRORS.forEach((url) => {
      post(url, body)
        .then((r) => {
          if (r.ok && !done) {
            done = true
            return r.json().then(resolve)
          }
          throw new Error(`HTTP ${r.status}`)
        })
        .catch(() => {
          failures += 1
          if (failures === MIRRORS.length && !done) {
            done = true
            resolve({ elements: [] })
          }
        })
    })
  })
}

export async function fetchProtection(lat, lng) {
  // is_in : retourne toutes les zones qui CONTIENNENT exactement ce point
  // + around:20 pour les cours d'eau représentés en linéaire (pas en polygone)
  const query = `[out:json][timeout:10];
(
  is_in(${lat},${lng});
  way["natural"="water"](around:20,${lat},${lng});
  way["waterway"~"river|stream|canal|drain"](around:20,${lat},${lng});
  relation["natural"="water"](around:20,${lat},${lng});
);
out tags;`

  const json = await raceOverpass('data=' + encodeURIComponent(query))
  const elements = json.elements ?? []

  // 1. Eau (priorité absolue)
  const isOnWater = elements.some((e) => {
    const t = e.tags ?? {}
    return (
      t.natural === 'water' ||
      ['river', 'stream', 'canal', 'drain', 'ditch'].includes(t.waterway) ||
      t.place === 'sea' || t.place === 'ocean'
    )
  })
  if (isOnWater) return { status: 'forbidden', zoneName: 'Zone aquatique', isWater: true }

  // 2. Zone strictement interdite (parc national, protect_class ≤ 2)
  const forbiddenEl = elements.find((e) => {
    const t = e.tags ?? {}
    const pc = t.protect_class
    return t.boundary === 'national_park' || pc === '1' || pc === '1a' || pc === '1b' || pc === '2'
  })
  if (forbiddenEl) {
    return { status: 'forbidden', zoneName: forbiddenEl.tags?.name ?? null, isWater: false }
  }

  // 3. Zone conditionnelle (réserve naturelle, zone protégée)
  const conditionalEl = elements.find((e) => {
    const t = e.tags ?? {}
    return t.leisure === 'nature_reserve' || t.boundary === 'protected_area' || t.protect_class
  })
  if (conditionalEl) {
    return { status: 'conditional', zoneName: conditionalEl.tags?.name ?? null, isWater: false }
  }

  return { status: 'allowed', zoneName: null, isWater: false }
}
