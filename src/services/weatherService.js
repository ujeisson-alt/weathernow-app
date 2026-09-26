/**
 * weatherService.js
 * Capa de acceso a datos: centraliza todas las llamadas del clima.
 * El navegador llama a /api/weather (función serverless propia), que a su vez
 * consulta OpenWeatherMap. Así la API Key nunca queda expuesta en el frontend.
 */

const API_URL = '/api/weather';

/**
 * Hace la petición al proxy /api/weather y traduce los errores HTTP
 * a mensajes claros para el usuario.
 * @param {'weather'|'forecast'} endpoint
 * @param {string} city
 * @param {AbortSignal} [signal]
 */
async function request(endpoint, city, signal) {
  const params = new URLSearchParams({ endpoint, q: city.trim() });

  let response;
  try {
    response = await fetch(`${API_URL}?${params}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Sin conexión. Revisá tu internet e intentá de nuevo.');
  }

  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('Ciudad no encontrada. Verificá el nombre e intentá de nuevo.');
      case 401:
        throw new Error('API Key inválida o aún no activada. Revisá la configuración.');
      case 429:
        throw new Error('Demasiadas búsquedas seguidas. Esperá un minuto e intentá de nuevo.');
      case 500:
        throw new Error('El servidor no tiene configurada la API Key. Revisá WEATHER_API_KEY.');
      default:
        throw new Error('Error al obtener el clima. Intentá más tarde.');
    }
  }

  return response.json();
}

/**
 * Clima actual de una ciudad.
 * @param {string} city
 * @param {AbortSignal} [signal]
 */
export function getCurrentWeather(city, signal) {
  return request('weather', city, signal);
}

/**
 * Pronóstico de 5 días.
 * /forecast devuelve 40 entradas (una cada 3 horas × 5 días). Las agrupamos por
 * fecha local de la ciudad y, para cada día, calculamos la mínima y máxima reales
 * y tomamos el ícono de la entrada más cercana al mediodía.
 * @param {string} city
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{date: string, dt: number, min: number, max: number, icon: string, description: string, pop: number}>>}
 */
export async function getForecast(city, signal) {
  const data = await request('forecast', city, signal);
  return groupForecastByDay(data.list, data.city?.timezone ?? 0);
}

/**
 * Agrupa las entradas de 3 horas en resúmenes diarios (máximo 5 días).
 * Exportada por separado para poder probarla sin llamar a la API.
 * @param {Array} list - data.list de /forecast
 * @param {number} timezoneOffset - desfase en segundos respecto a UTC (data.city.timezone)
 */
export function groupForecastByDay(list, timezoneOffset = 0) {
  const days = new Map();

  for (const item of list) {
    // Fecha y hora LOCAL de la ciudad consultada (no la del navegador)
    const local = new Date((item.dt + timezoneOffset) * 1000);
    const date = local.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const hour = local.getUTCHours();

    if (!days.has(date)) {
      days.set(date, { date, entries: [] });
    }
    days.get(date).entries.push({ ...item, hour });
  }

  return [...days.values()]
    .map(({ date, entries }) => {
      const midday = entries.reduce((best, e) =>
        Math.abs(e.hour - 12) < Math.abs(best.hour - 12) ? e : best
      );
      return {
        date,
        dt: midday.dt,
        min: Math.min(...entries.map((e) => e.main.temp_min)),
        max: Math.max(...entries.map((e) => e.main.temp_max)),
        icon: midday.weather[0].icon,
        description: midday.weather[0].description,
        pop: Math.round(Math.max(...entries.map((e) => e.pop ?? 0)) * 100),
      };
    })
    .slice(0, 5);
}

/** URL del ícono oficial de OpenWeatherMap. */
export const getIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
