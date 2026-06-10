export const spots = [
  {
    id: 1,
    name: 'Forêt de Fontainebleau',
    location: 'Seine-et-Marne, Île-de-France',
    lat: 48.400,
    lng: 2.700,
    status: 'allowed',
    // Polygone ~30×15 km, forme allongée E-O
    polygon: [
      [48.47, 2.52], [48.49, 2.65], [48.46, 2.80], [48.42, 2.90],
      [48.34, 2.86], [48.31, 2.72], [48.33, 2.57], [48.39, 2.48],
    ],
    weather: { nightTemp: 8, precipitation: 1.2, comfort: 'Confortable' },
    score: {
      total: 78,
      components: [
        { label: 'Réglementation', weight: 50, points: 50, max: 50 },
        { label: 'Température',    weight: 25, points: 18, max: 25 },
        { label: 'Précipitations', weight: 25, points: 10, max: 25 },
      ],
    },
  },
  {
    id: 2,
    name: 'Plateau de Millevaches',
    location: 'Corrèze, Nouvelle-Aquitaine',
    lat: 45.700,
    lng: 2.100,
    status: 'conditional',
    // Polygone ~70×50 km, large plateau arrondi
    polygon: [
      [45.93, 1.82], [45.97, 2.08], [45.91, 2.42], [45.76, 2.56],
      [45.57, 2.52], [45.46, 2.30], [45.49, 1.97], [45.62, 1.76],
      [45.80, 1.74],
    ],
    weather: { nightTemp: 4, precipitation: 3.8, comfort: 'Frais' },
    score: {
      total: 62,
      components: [
        { label: 'Réglementation', weight: 50, points: 30, max: 50 },
        { label: 'Température',    weight: 25, points: 20, max: 25 },
        { label: 'Précipitations', weight: 25, points: 12, max: 25 },
      ],
    },
  },
  {
    id: 3,
    name: 'Parc du Vercors',
    location: 'Drôme / Isère, Auvergne-Rhône-Alpes',
    lat: 44.900,
    lng: 5.500,
    status: 'forbidden',
    // Polygone ~55×30 km, massif allongé N-S
    polygon: [
      [45.16, 5.42], [45.11, 5.66], [44.99, 5.73], [44.83, 5.69],
      [44.65, 5.56], [44.60, 5.34], [44.68, 5.17], [44.86, 5.14],
      [45.03, 5.28],
    ],
    weather: { nightTemp: 2, precipitation: 6.5, comfort: 'Difficile' },
    score: {
      total: 34,
      components: [
        { label: 'Réglementation', weight: 50, points: 10, max: 50 },
        { label: 'Température',    weight: 25, points: 14, max: 25 },
        { label: 'Précipitations', weight: 25, points: 10, max: 25 },
      ],
    },
  },
  {
    id: 4,
    name: 'Forêt de Brocéliande',
    location: 'Ille-et-Vilaine, Bretagne',
    lat: 48.020,
    lng: -2.290,
    status: 'allowed',
    // Polygone ~20×15 km, forêt ramassée
    polygon: [
      [48.12, -2.46], [48.15, -2.28], [48.11, -2.13], [48.02, -2.09],
      [47.93, -2.17], [47.90, -2.33], [47.95, -2.45], [48.05, -2.49],
    ],
    weather: { nightTemp: 11, precipitation: 0.8, comfort: 'Confortable' },
    score: {
      total: 85,
      components: [
        { label: 'Réglementation', weight: 50, points: 50, max: 50 },
        { label: 'Température',    weight: 25, points: 23, max: 25 },
        { label: 'Précipitations', weight: 25, points: 12, max: 25 },
      ],
    },
  },
  {
    id: 5,
    name: 'Gorges du Verdon',
    location: 'Alpes-de-Haute-Provence, PACA',
    lat: 43.750,
    lng: 6.320,
    status: 'conditional',
    // Polygone ~35×12 km, gorge étroite allongée E-O
    polygon: [
      [43.80, 6.10], [43.83, 6.22], [43.82, 6.38], [43.79, 6.54],
      [43.72, 6.56], [43.67, 6.44], [43.68, 6.24], [43.72, 6.11],
    ],
    weather: { nightTemp: 15, precipitation: 0.3, comfort: 'Agréable' },
    score: {
      total: 71,
      components: [
        { label: 'Réglementation', weight: 50, points: 30, max: 50 },
        { label: 'Température',    weight: 25, points: 25, max: 25 },
        { label: 'Précipitations', weight: 25, points: 16, max: 25 },
      ],
    },
  },
]

export const statusConfig = {
  allowed:     { label: 'Autorisé',     color: '#2E7D32', bg: '#E8F5E9', text: '#1B5E20' },
  conditional: { label: 'Conditionnel', color: '#E65100', bg: '#FFF3E0', text: '#BF360C' },
  forbidden:   { label: 'Interdit',     color: '#C62828', bg: '#FFEBEE', text: '#B71C1C' },
}
