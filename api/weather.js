/**
 * Función serverless de Vercel: proxy hacia OpenWeatherMap.
 * La API Key vive SOLO en el servidor (variable WEATHER_API_KEY),
 * nunca llega al navegador.
 *
 * Uso: GET /api/weather?endpoint=weather|forecast&q=Bogota
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ALLOWED_ENDPOINTS = new Set(['weather', 'forecast']);

function send(res, status, body, cache = false) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Cachea 10 min en el CDN de Vercel: menos llamadas a la API y respuestas más rápidas
  res.setHeader('Cache-Control', cache ? 's-maxage=600, stale-while-revalidate=300' : 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return send(res, 405, { message: 'Método no permitido' });
  }

  const { searchParams } = new URL(req.url, 'http://localhost');
  const endpoint = searchParams.get('endpoint');
  const city = (searchParams.get('q') || '').trim();

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return send(res, 400, { message: 'Endpoint inválido' });
  }
  if (city.length < 2 || city.length > 60) {
    return send(res, 400, { message: 'Ciudad inválida' });
  }

  // WEATHER_API_KEY es la recomendada; VITE_WEATHER_API_KEY queda como respaldo temporal
  const apiKey = process.env.WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY;
  if (!apiKey) {
    return send(res, 500, { message: 'Falta configurar WEATHER_API_KEY en el servidor' });
  }

  const params = new URLSearchParams({ q: city, appid: apiKey, units: 'metric', lang: 'es' });

  try {
    const upstream = await fetch(`${BASE_URL}/${endpoint}?${params}`);
    const data = await upstream.json();
    return send(res, upstream.status, data, upstream.ok);
  } catch {
    return send(res, 502, { message: 'No se pudo contactar a OpenWeatherMap' });
  }
}
