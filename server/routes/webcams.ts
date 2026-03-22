/**
 * Webcams Routes — Live webcam feed metadata API.
 * Provides stream metadata for the Live Webcams panel.
 */
import { Router, type Request, type Response } from 'express';

const webcamsRouter = Router();

interface WebcamFeed {
  id: string;
  label: string;
  location: string;
  region: 'mideast' | 'europe' | 'americas' | 'asia' | 'space';
  lat: number;
  lon: number;
  status: 'live' | 'offline' | 'delayed';
  viewers: number;
  thumbnailUrl: string;
  streamUrl: string;
  tags: string[];
}

const WEBCAM_FEEDS: WebcamFeed[] = [
  // Middle East
  { id: 'cam-dubai-burj', label: 'Burj Khalifa Live', location: 'Dubai, UAE', region: 'mideast', lat: 25.1972, lon: 55.2744, status: 'live', viewers: 1243, thumbnailUrl: '#', streamUrl: '#', tags: ['landmark', 'uae'] },
  { id: 'cam-riyadh-ksa', label: 'Riyadh Financial District', location: 'Riyadh, KSA', region: 'mideast', lat: 24.7136, lon: 46.6753, status: 'live', viewers: 876, thumbnailUrl: '#', streamUrl: '#', tags: ['finance', 'ksa'] },
  { id: 'cam-doha-pearl', label: 'The Pearl, Qatar', location: 'Doha, Qatar', region: 'mideast', lat: 25.3695, lon: 51.5539, status: 'live', viewers: 654, thumbnailUrl: '#', streamUrl: '#', tags: ['landmark', 'qatar'] },
  { id: 'cam-muscat-port', label: 'Port Sultan Qaboos', location: 'Muscat, Oman', region: 'mideast', lat: 23.6142, lon: 58.5462, status: 'live', viewers: 321, thumbnailUrl: '#', streamUrl: '#', tags: ['port', 'oman'] },
  { id: 'cam-bahrain-wtc', label: 'Bahrain WTC', location: 'Manama, Bahrain', region: 'mideast', lat: 26.2285, lon: 50.5860, status: 'live', viewers: 445, thumbnailUrl: '#', streamUrl: '#', tags: ['finance', 'bahrain'] },
  { id: 'cam-kuwait-tower', label: 'Kuwait Towers', location: 'Kuwait City', region: 'mideast', lat: 29.3897, lon: 47.9945, status: 'live', viewers: 512, thumbnailUrl: '#', streamUrl: '#', tags: ['landmark', 'kuwait'] },
  { id: 'cam-hormuz', label: 'Strait of Hormuz', location: 'Hormuz, Iran', region: 'mideast', lat: 26.5944, lon: 56.4728, status: 'live', viewers: 2341, thumbnailUrl: '#', streamUrl: '#', tags: ['maritime', 'strategic'] },
  { id: 'cam-bab-mandeb', label: 'Bab el-Mandeb Strait', location: 'Yemen/Djibouti', region: 'mideast', lat: 12.5833, lon: 43.3333, status: 'live', viewers: 1876, thumbnailUrl: '#', streamUrl: '#', tags: ['maritime', 'strategic'] },
  { id: 'cam-suez', label: 'Suez Canal', location: 'Suez, Egypt', region: 'mideast', lat: 30.0044, lon: 32.5731, status: 'live', viewers: 3210, thumbnailUrl: '#', streamUrl: '#', tags: ['maritime', 'strategic'] },

  // Europe
  { id: 'cam-london-lloyds', label: "Lloyd's of London", location: 'London, UK', region: 'europe', lat: 51.5128, lon: -0.0828, status: 'live', viewers: 987, thumbnailUrl: '#', streamUrl: '#', tags: ['insurance', 'finance'] },
  { id: 'cam-zurich-swiss', label: 'Swiss Re HQ', location: 'Zurich, CH', region: 'europe', lat: 47.3769, lon: 8.5417, status: 'live', viewers: 654, thumbnailUrl: '#', streamUrl: '#', tags: ['reinsurance', 'finance'] },
  { id: 'cam-frankfurt-ecb', label: 'ECB Frankfurt', location: 'Frankfurt, DE', region: 'europe', lat: 50.1109, lon: 8.6821, status: 'live', viewers: 543, thumbnailUrl: '#', streamUrl: '#', tags: ['central-bank', 'finance'] },
  { id: 'cam-paris-bourse', label: 'Bourse de Paris', location: 'Paris, FR', region: 'europe', lat: 48.8698, lon: 2.3414, status: 'live', viewers: 432, thumbnailUrl: '#', streamUrl: '#', tags: ['exchange', 'finance'] },

  // Americas
  { id: 'cam-nyc-wall', label: 'Wall Street', location: 'New York, USA', region: 'americas', lat: 40.7069, lon: -74.0089, status: 'live', viewers: 4321, thumbnailUrl: '#', streamUrl: '#', tags: ['finance', 'exchange'] },
  { id: 'cam-houston-energy', label: 'Houston Energy Corridor', location: 'Houston, USA', region: 'americas', lat: 29.7593, lon: -95.6327, status: 'live', viewers: 876, thumbnailUrl: '#', streamUrl: '#', tags: ['energy', 'oil'] },
  { id: 'cam-bermuda-re', label: 'Bermuda Re District', location: 'Hamilton, BM', region: 'americas', lat: 32.2949, lon: -64.7820, status: 'live', viewers: 234, thumbnailUrl: '#', streamUrl: '#', tags: ['reinsurance', 'offshore'] },

  // Asia
  { id: 'cam-singapore-cbd', label: 'Singapore CBD', location: 'Singapore', region: 'asia', lat: 1.2789, lon: 103.8536, status: 'live', viewers: 1543, thumbnailUrl: '#', streamUrl: '#', tags: ['finance', 'hub'] },
  { id: 'cam-hk-ifc', label: 'Hong Kong IFC', location: 'Hong Kong', region: 'asia', lat: 22.2855, lon: 114.1577, status: 'live', viewers: 1234, thumbnailUrl: '#', streamUrl: '#', tags: ['finance', 'exchange'] },
  { id: 'cam-tokyo-boj', label: 'Bank of Japan', location: 'Tokyo, JP', region: 'asia', lat: 35.6855, lon: 139.7588, status: 'live', viewers: 987, thumbnailUrl: '#', streamUrl: '#', tags: ['central-bank', 'finance'] },
  { id: 'cam-mumbai-bse', label: 'BSE Mumbai', location: 'Mumbai, India', region: 'asia', lat: 18.9308, lon: 72.8347, status: 'live', viewers: 765, thumbnailUrl: '#', streamUrl: '#', tags: ['exchange', 'finance'] },

  // Space / ISS
  { id: 'cam-iss-live', label: 'ISS Live Earth View', location: 'Low Earth Orbit', region: 'space', lat: 0, lon: 0, status: 'live', viewers: 8765, thumbnailUrl: '#', streamUrl: '#', tags: ['space', 'earth'] },
  { id: 'cam-goes-east', label: 'GOES-East Satellite', location: 'Geostationary', region: 'space', lat: 0, lon: -75.2, status: 'live', viewers: 2345, thumbnailUrl: '#', streamUrl: '#', tags: ['weather', 'satellite'] },
];

webcamsRouter.get('/', (_req: Request, res: Response) => {
  const region = (_req.query.region as string) || 'all';
  const status = (_req.query.status as string) || 'all';
  const limit = parseInt((_req.query.limit as string) || '50', 10);

  let feeds = [...WEBCAM_FEEDS];

  // Randomize viewer counts slightly each request
  feeds = feeds.map((f) => ({
    ...f,
    viewers: f.viewers + Math.floor((Math.random() - 0.5) * 100),
  }));

  if (region !== 'all') {
    feeds = feeds.filter((f) => f.region === region);
  }
  if (status !== 'all') {
    feeds = feeds.filter((f) => f.status === status);
  }

  res.json({
    data: feeds.slice(0, limit),
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-webcam-aggregator',
      totalFeeds: WEBCAM_FEEDS.length,
      liveCount: feeds.filter((f) => f.status === 'live').length,
    },
  });
});

webcamsRouter.get('/regions', (_req: Request, res: Response) => {
  const regions = ['mideast', 'europe', 'americas', 'asia', 'space'];
  res.json({
    data: regions.map((r) => ({
      id: r,
      label: r.charAt(0).toUpperCase() + r.slice(1),
      count: WEBCAM_FEEDS.filter((f) => f.region === r).length,
    })),
    meta: { timestamp: new Date().toISOString(), version: '4.0.0' },
  });
});

export { webcamsRouter };
