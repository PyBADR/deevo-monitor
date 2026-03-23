/**
 * DEEVO Map Configuration — GCC-Locked Viewport
 * MapLibre GL base configuration for GCC Decision Intelligence Map
 */

export const GCC_CENTER: [number, number] = [50, 24]; // [lng, lat]
export const GCC_ZOOM = 4.5;
export const GCC_MIN_ZOOM = 3;
export const GCC_MAX_ZOOM = 12;

/** GCC bounding box — prevents scrolling outside the region */
export const GCC_BOUNDS: [[number, number], [number, number]] = [
  [36, 12],  // Southwest: covers Yemen coast
  [62, 32],  // Northeast: covers Iran border
];

/** Dark professional map style — CartoDB Dark Matter */
export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/** GCC country coordinates for overlays */
export const GCC_COUNTRIES = {
  SA: { name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', lat: 24.7136, lng: 45.0792 },
  AE: { name: 'UAE', nameAr: 'الإمارات', lat: 24.4539, lng: 54.3773 },
  QA: { name: 'Qatar', nameAr: 'قطر', lat: 25.2854, lng: 51.5310 },
  KW: { name: 'Kuwait', nameAr: 'الكويت', lat: 29.3759, lng: 47.9774 },
  BH: { name: 'Bahrain', nameAr: 'البحرين', lat: 26.0667, lng: 50.5577 },
  OM: { name: 'Oman', nameAr: 'عُمان', lat: 23.5880, lng: 58.3829 },
} as const;
