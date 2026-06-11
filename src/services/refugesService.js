function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10
}

export async function fetchNearbyBivouacs(lat, lng) {
  const delta = 0.3 // ~30 km
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const url = `https://www.refuges.info/api/nb_points/bbox?nb_points=5&bbox=${bbox}&type_points=7`

  try {
    const resp = await fetch(url)
    if (!resp.ok) return []
    const json = await resp.json()
    return (json.features ?? [])
      .map((f) => ({
        name: f.properties.nom,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        distance: haversine(lat, lng, f.geometry.coordinates[1], f.geometry.coordinates[0]),
        lien: f.properties.lien ?? null,
      }))
      .sort((a, b) => a.distance - b.distance)
  } catch (_) {
    return []
  }
}
