export async function fetchLocation(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${lat}&lon=${lng}&format=json&accept-language=fr`

  const resp = await fetch(url, {
    headers: { 'User-Agent': 'HippyApp/1.0' },
  })
  if (!resp.ok) throw new Error('NOMINATIM_ERROR')

  const json = await resp.json()

  if (!json.address) throw new Error('HORS_TERRE')
  if (json.address.country_code !== 'fr') throw new Error('HORS_FRANCE')

  // Vérifie que ce n'est pas un point sur l'eau (mer, lac, rivière, canal…)
  const waterTypes = new Set([
    'ocean', 'sea', 'strait', 'bay',
    'lake', 'river', 'water', 'reservoir',
    'wetland', 'stream', 'canal', 'drain', 'pond',
  ])
  const isWater = waterTypes.has(json.type) ||
    json.class === 'waterway' ||
    (json.class === 'natural' && waterTypes.has(json.type)) ||
    json.address?.water != null ||
    json.address?.river != null ||
    json.address?.stream != null
  if (isWater) throw new Error('EN_MER')
  if (!json.address.country) throw new Error('HORS_TERRE')

  const parts = [
    json.address.village ||
      json.address.town ||
      json.address.city ||
      json.address.municipality ||
      json.address.hamlet,
    json.address.county || json.address.state_district,
    json.address.state,
  ].filter(Boolean)

  return parts.slice(0, 2).join(', ') || 'France'
}
