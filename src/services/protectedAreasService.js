const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
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

export async function fetchProtection(lat, lng) {
  const query = `[out:json][timeout:10];
(
  relation["boundary"="national_park"](around:100,${lat},${lng});
  relation["leisure"="nature_reserve"](around:100,${lat},${lng});
  relation["boundary"="protected_area"](around:100,${lat},${lng});
);
out tags 5;`

  const body = 'data=' + encodeURIComponent(query)
  let elements = []

  for (const url of MIRRORS) {
    try {
      const r = await post(url, body)
      if (r.ok) {
        const j = await r.json()
        elements = j.elements ?? []
        break
      }
    } catch (_) {}
  }

  const zoneName = elements[0]?.tags?.name ?? null

  const forbidden = elements.some((e) => {
    const pc = e.tags?.protect_class
    return (
      e.tags?.boundary === 'national_park' ||
      pc === '2' || pc === '1a' || pc === '1b'
    )
  })

  const status = forbidden
    ? 'forbidden'
    : elements.length > 0
    ? 'conditional'
    : 'allowed'

  return { status, zoneName }
}
