import { statusConfig } from '../data/spots'

export function buildMainMapHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { box-sizing: border-box; }
    html, body, #map { height: 100%; margin: 0; padding: 0; }

    /* Popup */
    .leaflet-popup-content-wrapper {
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12); padding: 0; overflow: hidden;
    }
    .leaflet-popup-content { margin: 0; }
    .leaflet-popup-tip { background: #fff; }

    /* Tip card */
    #tip {
      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #fff; border-radius: 14px; z-index: 1000;
      padding: 12px 20px; font-family: -apple-system, system-ui, sans-serif;
      font-size: 13px; font-weight: 600; color: #4A6A4A;
      box-shadow: 0 4px 20px rgba(0,0,0,0.10);
      border: 1px solid #F0F4F1;
      display: flex; align-items: center; gap: 8px;
      white-space: nowrap; pointer-events: none;
    }
    #tip-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #00C853;
      animation: blink 1.4s ease-in-out infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; } 50% { opacity: 0.2; }
    }

    /* Pin marker */
    .pin-wrap { position: relative; width: 32px; height: 40px; }
    .pin-head {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 22px; height: 22px; border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    }
    .pin-tail {
      position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
    }
    .pin-ring {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 22px; height: 22px; border-radius: 50%;
      border: 2px solid;
      animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;
    }
    @keyframes ping {
      0%   { transform: translateX(-50%) scale(0.8); opacity: 0.9; }
      75%  { transform: translateX(-50%) scale(2.2); opacity: 0; }
      100% { transform: translateX(-50%) scale(2.2); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="tip"><div id="tip-dot"></div>Touchez la carte pour analyser un spot</div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([46.8, 2.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map);

    var marker = null;
    var COLOR = '#00C853';

    function makeIcon(color) {
      return L.divIcon({
        className: '',
        html: '<div class="pin-wrap">'
          + '<div class="pin-ring" style="border-color:' + color + '"></div>'
          + '<div class="pin-head" style="background:' + color + '"></div>'
          + '<div class="pin-tail" style="border-top:14px solid ' + color + '"></div>'
          + '</div>',
        iconSize:   [32, 40],
        iconAnchor: [16, 40],
        popupAnchor:[0, -44],
      });
    }

    function placeMarker(latlng) {
      document.getElementById('tip').style.display = 'none';
      if (!marker) {
        marker = L.marker(latlng, { icon: makeIcon(COLOR), draggable: true }).addTo(map);
        marker.on('dragend', function() {
          send(marker.getLatLng());
        });
      } else {
        marker.setLatLng(latlng);
      }
      send(latlng);
    }

    function send(latlng) {
      var msg = JSON.stringify({ type: 'tap', lat: latlng.lat, lng: latlng.lng });
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
      else window.parent.postMessage(msg, '*');
    }

    map.on('click', function(e) { placeMarker(e.latlng); });

    /* Called from React Native to update pin color after analysis */
    window.setMarkerColor = function(color) {
      COLOR = color;
      if (marker) marker.setIcon(makeIcon(color));
    };
  </script>
</body>
</html>`
}

export function buildSpotMapHtml(spot) {
  const color = statusConfig[spot.status].color
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .pin-wrap { position: relative; width: 32px; height: 40px; }
    .pin-head {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 22px; height: 22px; border-radius: 50%;
      border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    }
    .pin-tail {
      position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 7px solid transparent; border-right: 7px solid transparent;
    }
    .pin-ring {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 22px; height: 22px; border-radius: 50%; border: 2px solid;
      animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;
    }
    @keyframes ping {
      0%   { transform: translateX(-50%) scale(0.8); opacity: 0.9; }
      75%  { transform: translateX(-50%) scale(2.2); opacity: 0; }
      100% { transform: translateX(-50%) scale(2.2); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      zoomControl: false, dragging: false,
      scrollWheelZoom: false, attributionControl: false,
    }).setView([${spot.lat}, ${spot.lng}], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var icon = L.divIcon({
      className: '',
      html: '<div class="pin-wrap">'
        + '<div class="pin-ring" style="border-color:${color}"></div>'
        + '<div class="pin-head" style="background:${color}"></div>'
        + '<div class="pin-tail" style="border-top:14px solid ${color}"></div>'
        + '</div>',
      iconSize: [32, 40], iconAnchor: [16, 40],
    });
    L.marker([${spot.lat}, ${spot.lng}], { icon }).addTo(map);
  </script>
</body>
</html>`
}
