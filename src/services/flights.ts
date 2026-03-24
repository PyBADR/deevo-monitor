// ─── DEEVO CORTEX — ADS-B LIVE FLIGHT SERVICE ───────────────────────────────
// OpenSky Network free API — no key required for limited use
// GCC bounding box: lat 12–32, lng 34–60

export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  altitude_m: number;
  velocity_ms: number;
  heading: number;
  on_ground: boolean;
  airline?: string;
  route?: string;
}

export interface FlightStats {
  total: number;
  in_gcc: number;
  by_country: Record<string, number>;
  by_airport: Record<string, number>;
  updated_at: number;
  source: 'live' | 'seed';
}

// GCC bounding box
const GCC_BBOX = { lomin: 34, lomax: 60, lamin: 12, lamax: 32 };

// Seed data for when API is unavailable
const SEED_STATS: FlightStats = {
  total: 847,
  in_gcc: 312,
  by_country: { UAE: 98, SA: 87, KW: 42, QA: 38, BH: 28, OM: 19 },
  by_airport: { DXB: 68, RUH: 44, DOH: 38, KWI: 28, AUH: 24, JED: 22, BAH: 18, MCT: 14, SHJ: 12, DMM: 8 },
  updated_at: Date.now(),
  source: 'seed',
};

// GCC airport proximity detection
const GCC_AIRPORTS: { iata: string; country: string; lat: number; lng: number }[] = [
  { iata: 'DXB', country: 'UAE', lat: 25.253, lng: 55.365 },
  { iata: 'AUH', country: 'UAE', lat: 24.433, lng: 54.651 },
  { iata: 'SHJ', country: 'UAE', lat: 25.328, lng: 55.517 },
  { iata: 'RUH', country: 'SA', lat: 24.958, lng: 46.699 },
  { iata: 'JED', country: 'SA', lat: 21.670, lng: 39.156 },
  { iata: 'DMM', country: 'SA', lat: 26.471, lng: 49.799 },
  { iata: 'DOH', country: 'QA', lat: 25.273, lng: 51.608 },
  { iata: 'KWI', country: 'KW', lat: 29.226, lng: 47.969 },
  { iata: 'BAH', country: 'BH', lat: 26.271, lng: 50.634 },
  { iata: 'MCT', country: 'OM', lat: 23.593, lng: 58.284 },
];

function closestAirport(lat: number, lng: number): string | null {
  let min = Infinity;
  let closest: string | null = null;
  for (const apt of GCC_AIRPORTS) {
    const d = Math.sqrt(Math.pow(lat - apt.lat, 2) + Math.pow(lng - apt.lng, 2));
    if (d < 1.5 && d < min) { min = d; closest = apt.iata; }
  }
  return closest;
}

export async function fetchGCCFlights(): Promise<{ flights: Flight[]; stats: FlightStats }> {
  try {
    const { lomin, lomax, lamin, lamax } = GCC_BBOX;
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`OpenSky ${res.status}`);

    const data = await res.json();
    const states: unknown[][] = data.states ?? [];

    const flights: Flight[] = states
      .filter((s): s is unknown[] => Array.isArray(s) && s[5] != null && s[6] != null)
      .map(s => ({
        icao24: String(s[0] ?? ''),
        callsign: String(s[1] ?? '').trim(),
        origin_country: String(s[2] ?? ''),
        longitude: Number(s[5]),
        latitude: Number(s[6]),
        altitude_m: Number(s[7] ?? 0),
        velocity_ms: Number(s[9] ?? 0),
        heading: Number(s[10] ?? 0),
        on_ground: Boolean(s[8]),
      }))
      .filter(f => !f.on_ground);

    // Build stats
    const by_country: Record<string, number> = {};
    const by_airport: Record<string, number> = {};

    for (const f of flights) {
      const apt = closestAirport(f.latitude, f.longitude);
      if (apt) by_airport[apt] = (by_airport[apt] || 0) + 1;
      // Detect GCC country by position
      if (f.latitude < 32 && f.longitude > 34) {
        if (f.longitude > 51 && f.longitude < 58) by_country['UAE'] = (by_country['UAE'] || 0) + 1;
        else if (f.longitude > 46 && f.longitude < 51) by_country['SA'] = (by_country['SA'] || 0) + 1;
        else if (f.latitude > 28 && f.longitude > 46 && f.longitude < 50) by_country['KW'] = (by_country['KW'] || 0) + 1;
        else if (f.longitude > 50 && f.longitude < 52) by_country['QA'] = (by_country['QA'] || 0) + 1;
        else if (f.longitude > 50 && f.longitude < 51) by_country['BH'] = (by_country['BH'] || 0) + 1;
        else by_country['OM'] = (by_country['OM'] || 0) + 1;
      }
    }

    return {
      flights: flights.slice(0, 500),
      stats: {
        total: states.length,
        in_gcc: flights.length,
        by_country,
        by_airport,
        updated_at: Date.now(),
        source: 'live',
      },
    };
  } catch {
    // Graceful degradation
    return { flights: [], stats: SEED_STATS };
  }
}

export { SEED_STATS };
