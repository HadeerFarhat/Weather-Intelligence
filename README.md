# AETHER — Weather Intelligence

**Beyond the forecast. Experience the atmosphere.**

A modern, brand-driven weather platform with real geographic coverage of all 27 Egyptian governorates and adaptive visual atmosphere.

## Identity

| Element | Value |
|---------|--------|
| Brand | AETHER |
| Tagline | Beyond the forecast. Experience the atmosphere. |
| Focus | Precision · Intelligence · Atmosphere |

## Core capabilities

### Real Egypt coverage
- All **27 governorates** with verified lat/lon
- Interactive map + filterable list
- Each selection triggers a **unique API request** with that location’s coordinates
- Coordinates always visible under the location name
- Console logs every request for verification

### Dashboard
- Hero temperature + condition + dynamic atmosphere
- Hourly (24h) + rain probability
- 7-day outlook with range bars
- Temperature trend chart (Chart.js)
- Humidity, wind, pressure, UV, visibility, clouds
- Sunrise / sunset timeline
- Rule-based insights (clothing, UV, heat, wind)

### Adaptive atmosphere
Visual system responds to weather condition + local hour:
- clear · cloud · rain · storm · snow · fog · night

### Settings (persistent)
- Dark / Light / System theme
- Arabic (RTL) ↔ English (LTR)
- °C / °F · wind units · 12/24h
- Export / import settings JSON
- Clear recent & favorites

### Locations
- Favorites · recent · geolocation · global search (Egypt prioritized)

## Structure

```
AETHER/
├── index.html
├── css/aether.css
├── js/aether.js
├── data/egypt-governorates.json
└── README.md
```

## Run

```bash
cd AETHER
python -m http.server 8080
```

Open **http://localhost:8080**

No API key required (Open-Meteo).

## Verify governorate requests

1. Open DevTools → Console  
2. Select **Aswan** on the map  
3. You should see:
```
[AETHER] API request: { lat: 24.0889, lon: 32.8998, ... }
[AETHER] API response for 24.0889 32.8998 → temp= …
```
4. Select **Matrouh** — different coordinates appear.

## Known limitation

Open-Meteo free tier has a daily rate limit. When hit, the UI shows a clear message. Architecture still sends correct per-governorate coordinates.

## Attribution

Weather data: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
