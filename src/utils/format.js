/** Utilidades de formato para mostrar datos del clima. */

/** Redondea una temperatura y agrega el símbolo de grados. */
export const formatTemp = (value) => `${Math.round(value)}°`;

/** Convierte m/s (unidad de la API) a km/h, más familiar para el usuario. */
export const msToKmh = (ms) => Math.round(ms * 3.6);

/** Pone en mayúscula la primera letra ("cielo claro" → "Cielo claro"). */
export const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Nombre corto del día a partir de 'YYYY-MM-DD' (ej: "jue 24").
 * Se usa UTC para que la fecha no se corra por la zona horaria del navegador.
 */
export function formatDay(isoDate) {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return capitalize(
    date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', timeZone: 'UTC' })
  );
}

/** Hora local de la ciudad (HH:MM) a partir de un timestamp Unix y el desfase de la API. */
export function formatLocalTime(unixSeconds, timezoneOffset) {
  const date = new Date((unixSeconds + timezoneOffset) * 1000);
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}
