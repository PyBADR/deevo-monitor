import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const variant = env.VITE_VARIANT || 'world';

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@layers': resolve(__dirname, 'src/layers'),
        '@panels': resolve(__dirname, 'src/panels'),
        '@services': resolve(__dirname, 'src/services'),
        '@data': resolve(__dirname, 'src/data'),
        '@types': resolve(__dirname, 'src/types'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
    },
    define: {
      __VARIANT__: JSON.stringify(variant),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://localhost:3001',
          ws: true,
        },
      },
    },
    build: {
      target: 'es2022',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'map-engine': ['@deck.gl/core', '@deck.gl/layers', '@deck.gl/geo-layers', 'maplibre-gl'],
            'globe': ['globe.gl', 'three'],
            'charts': ['chart.js', 'd3'],
          },
        },
      },
    },
  };
});
