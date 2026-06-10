# Hippy — Bivouaquer en toute sérénité

POC mobile Expo Go d'un assistant bivouac responsable. 3 écrans navigables, données fictives, aucun backend.

## Stack

- **Expo SDK 51** (Expo Go compatible)
- **React Navigation v6** — navigation native entre écrans
- **react-native-webview** — carte Leaflet.js (OSM, pas de clé API)
- **react-native-svg** — jauge circulaire du score

## Installation

```bash
npm install
```

### Mobile (Expo Go)
```bash
npx expo start
```
Scanner le QR code avec **Expo Go** (iOS ou Android).

### Web (localhost)
```bash
npm run web
# ou
npx expo start --web
```
Ouvre automatiquement [http://localhost:8081](http://localhost:8081).

## Écrans

| Écran | Route Nav | Description |
|-------|-----------|-------------|
| Carte | `Map` | Carte France plein écran, 5 marqueurs colorés |
| Détail spot | `SpotDetail` | Mini-carte + météo + jauge score |
| Détail score | `ScoreDetail` | Barres de progression par critère |

## Données

Toutes les données sont fictives, codées en dur dans `src/data/spots.js`.
La carte charge Leaflet depuis unpkg.com — connexion internet requise.
