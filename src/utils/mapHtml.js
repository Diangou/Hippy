import { spots, statusConfig } from '../data/spots'

export function buildMainMapHtml() {
  const spotsData = spots.map((s) => ({
    id: s.id,
    name: s.name,
    color: statusConfig[s.status].color,
    statusLabel: statusConfig[s.status].label,
    polygon: s.polygon,
  }))

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e8e0d8; }

    /* Popup */
    .leaflet-popup-content-wrapper {
      border-radius: 14px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.18);
      padding: 0;
      overflow: hidden;
    }
    .leaflet-popup-content { margin: 0; }
    .leaflet-popup-tip-container { display: none; }

    .popup-inner {
      padding: 14px 16px 12px;
      font-family: -apple-system, sans-serif;
      text-align: center;
      min-width: 160px;
    }
    .popup-name {
      font-size: 14px; font-weight: 700; color: #111; margin-bottom: 8px;
    }
    .popup-badge {
      display: inline-block; padding: 3px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 700; color: white;
    }
    .popup-btn {
      display: block; width: 100%; margin-top: 10px; padding: 8px 0;
      background: #2E7D32; color: white; border: none; border-radius: 8px;
      font-size: 13px; font-weight: 700; cursor: pointer;
    }

    /* Label zone */
    .zone-label {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 11px;
      font-weight: 800;
      color: white;
      text-shadow: 0 1px 4px rgba(0,0,0,0.55), 0 0 8px rgba(0,0,0,0.3);
      white-space: nowrap;
      letter-spacing: 0.3px;
      pointer-events: none;
    }
    .zone-label::before { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([46.8, 2.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 18
    }).addTo(map);

    var spots = ${JSON.stringify(spotsData)};

    spots.forEach(function(spot) {
      var poly = L.polygon(spot.polygon, {
        color: spot.color,
        weight: 2.5,
        opacity: 0.95,
        fillColor: spot.color,
        fillOpacity: 0.30,
        lineJoin: 'round',
      }).addTo(map);

      /* Label centré dans la zone */
      poly.bindTooltip(spot.name, {
        permanent: true,
        direction: 'center',
        className: 'zone-label',
      });

      /* Popup au clic */
      poly.bindPopup(
        '<div class="popup-inner">'
        + '<div class="popup-name">' + spot.name + '</div>'
        + '<span class="popup-badge" style="background:' + spot.color + '">' + spot.statusLabel + '</span>'
        + '<button class="popup-btn" onclick="sendSpot(' + spot.id + ')">Voir le détail →</button>'
        + '</div>',
        { closeButton: false, minWidth: 160 }
      );

      /* Survol — légère accentuation */
      poly.on('mouseover', function() {
        this.setStyle({ fillOpacity: 0.48, weight: 3 });
      });
      poly.on('mouseout', function() {
        this.setStyle({ fillOpacity: 0.30, weight: 2.5 });
      });
    });

    function sendSpot(id) {
      var msg = JSON.stringify({ type: 'navigate', id: id });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      } else {
        window.parent.postMessage(msg, '*');
      }
    }
  </script>
</body>
</html>`
}

export function buildSpotMapHtml(spot) {
  const color = statusConfig[spot.status].color
  const polygonJSON = JSON.stringify(spot.polygon)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var coords = ${polygonJSON};
    var map = L.map('map', { zoomControl: false, dragging: false, scrollWheelZoom: false, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var poly = L.polygon(coords, {
      color: '${color}',
      weight: 2.5,
      opacity: 0.95,
      fillColor: '${color}',
      fillOpacity: 0.28,
      lineJoin: 'round',
    }).addTo(map);

    /* Ajuste le zoom pour afficher toute la zone */
    map.fitBounds(poly.getBounds(), { padding: [20, 20] });
  </script>
</body>
</html>`
}
