/**
 * GCC region boundaries — simplified GeoJSON polygons for all 6 countries.
 * Used by GeopoliticalLayer for DRI color-coding.
 */
export const gccRegionsGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { code: "KW", name: "Kuwait", nameAr: "الكويت", capital: "Kuwait City" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [46.55, 29.96], [47.46, 30.08], [48.0, 30.06], [48.42, 29.96],
          [48.42, 29.55], [48.18, 29.36], [48.08, 29.2], [47.97, 29.0],
          [47.72, 28.97], [47.43, 29.0], [46.89, 29.1], [46.55, 29.4],
          [46.55, 29.96],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { code: "SA", name: "Saudi Arabia", nameAr: "المملكة العربية السعودية", capital: "Riyadh" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [36.5, 29.2], [37.5, 31.5], [39.0, 32.0], [39.2, 29.4],
          [42.0, 27.0], [44.7, 29.4], [46.5, 29.4], [47.4, 29.0],
          [47.7, 28.5], [48.4, 28.0], [49.2, 27.5], [50.0, 26.2],
          [50.8, 25.0], [51.2, 24.5], [51.6, 24.0], [51.6, 22.6],
          [55.1, 22.6], [55.2, 22.0], [55.6, 20.0], [52.6, 19.0],
          [52.0, 18.2], [49.0, 18.6], [48.2, 18.2], [46.3, 16.6],
          [43.0, 17.4], [41.2, 16.8], [39.6, 18.0], [38.5, 17.9],
          [37.4, 18.0], [36.9, 20.0], [36.5, 22.0], [35.2, 24.0],
          [34.6, 28.0], [36.5, 29.2],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { code: "AE", name: "UAE", nameAr: "الإمارات", capital: "Abu Dhabi" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [51.6, 24.0], [51.6, 24.5], [51.9, 24.6], [52.6, 24.2],
          [53.6, 24.1], [54.3, 24.4], [55.0, 24.9], [55.5, 25.3],
          [56.0, 25.3], [56.0, 26.0], [56.38, 26.2], [56.27, 25.72],
          [56.4, 25.1], [56.1, 24.7], [55.8, 24.2], [55.1, 22.6],
          [51.6, 22.6], [51.6, 24.0],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { code: "QA", name: "Qatar", nameAr: "قطر", capital: "Doha" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [50.75, 24.9], [50.8, 25.4], [50.94, 25.75], [51.1, 26.0],
          [51.25, 26.15], [51.55, 26.2], [51.6, 25.9], [51.57, 25.5],
          [51.52, 25.2], [51.35, 24.95], [51.1, 24.6], [50.85, 24.7],
          [50.75, 24.9],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { code: "BH", name: "Bahrain", nameAr: "البحرين", capital: "Manama" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [50.35, 25.8], [50.38, 26.05], [50.45, 26.25], [50.58, 26.3],
          [50.65, 26.18], [50.65, 25.95], [50.58, 25.8], [50.47, 25.77],
          [50.35, 25.8],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { code: "OM", name: "Oman", nameAr: "عمان", capital: "Muscat" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [56.27, 25.72], [56.38, 26.2], [56.5, 26.35], [56.84, 26.36],
          [56.8, 26.0], [56.7, 25.0], [57.5, 23.9], [58.8, 23.3],
          [59.8, 22.5], [59.5, 21.5], [58.5, 20.4], [57.8, 19.8],
          [57.0, 19.0], [55.6, 20.0], [55.2, 22.0], [55.1, 22.6],
          [55.8, 24.2], [56.1, 24.7], [56.4, 25.1], [56.27, 25.72],
        ]],
      },
    },
  ],
};
