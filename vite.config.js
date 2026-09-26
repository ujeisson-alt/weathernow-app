import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import weatherHandler from './api/weather.js';

/**
 * En desarrollo (npm run dev) sirve /api/weather con la misma función
 * que usa Vercel en producción, leyendo la key desde .env.
 */
function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/weather', (req, res) => {
        if (env.WEATHER_API_KEY) process.env.WEATHER_API_KEY = env.WEATHER_API_KEY;
        req.url = req.originalUrl;
        weatherHandler(req, res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' = cargar todas las variables del .env (no solo las VITE_)
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), localApi(env)],
  };
});
