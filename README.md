# WeatherNow App ⛅

Aplicación web de consulta climática en tiempo real construida con **React + Vite** para **SkyPulse Inc.**
Muestra el clima actual y el pronóstico de 5 días de cualquier ciudad del mundo, con ciudades favoritas que se guardan en el navegador.

## Demo en vivo

🔗 **[https://weathernow-app.vercel.app](https://weathernow-app.vercel.app)** <!-- Reemplazá con tu URL real de Vercel -->

<!-- Cuando tengas el deploy, agregá una captura: ![WeatherNow](./docs/screenshot.png) -->

## Tecnologías

| Tecnología | Uso | Por qué |
|---|---|---|
| React 19 + Vite | UI y bundler | Arranque instantáneo, HMR rápido, estándar actual para SPAs |
| JavaScript ES6+ | Lógica | async/await, módulos, destructuring |
| CSS3 (Variables, Flexbox, Grid) | Estilos | Mobile-first, theming y dark mode sin librerías |
| OpenWeatherMap API | Datos | Endpoints `/weather` y `/forecast`, plan gratuito |
| localStorage | Persistencia | Favoritos sin backend |
| PropTypes | Validación de props | Documenta el contrato de cada componente |
| oxlint | Linter | Detecta variables sin usar y errores comunes |

## Funcionalidades

- 🔎 Búsqueda de clima por nombre de ciudad (Enter o botón), con validación de entrada
- 🌡️ Clima actual: temperatura, sensación térmica, humedad, viento (km/h), mín/máx, ícono y hora local
- 📅 Pronóstico de 5 días con mínima y máxima **reales** de cada día y probabilidad de lluvia
- ⭐ Ciudades favoritas persistentes (sin duplicados, clic para consultar, × para quitar)
- 📱 Diseño responsive mobile-first (375 px, 768 px, 1280 px) y dark mode automático
- ⚠️ Estados de carga, error (404, 401, 429, sin conexión) con botón *Reintentar* y empty state
- ♿ Accesibilidad: navegación por teclado, `aria-label`, `role="alert"`, `prefers-reduced-motion`

## Arquitectura de componentes

```
App                      ← estado principal (clima, pronóstico, carga, error)
├── SearchBar            ← formulario de búsqueda
├── FavoritesList        ← chips de ciudades favoritas (useFavorites)
├── StatusMessage        ← loading / error / empty state
├── CurrentWeather       ← tarjeta del clima actual + botón favorito
└── ForecastList         ← contenedor del pronóstico
    └── ForecastCard     ← tarjeta de un día (× 5)
```

```
src/
├── components/     Componentes de UI
├── services/       weatherService.js → todas las llamadas a la API
├── hooks/          useFavorites.js → custom hook con localStorage
├── utils/          format.js → formato de temperaturas, fechas y viento
├── styles/         global.css + estilos por componente
├── App.jsx
└── main.jsx
```

### Decisiones técnicas

- **Capa de servicios separada:** los componentes nunca llaman a `fetch`; así la API se puede cambiar o simular en un solo lugar.
- **`Promise.all`:** clima actual y pronóstico se piden en paralelo (≈ el doble de rápido).
- **`AbortController`:** si el usuario busca otra ciudad antes de que termine la anterior, la petición vieja se cancela y no pisa el resultado nuevo.
- **Pronóstico agrupado por día:** `/forecast` devuelve 40 entradas (cada 3 h × 5 días). Se agrupan por fecha **local de la ciudad**, se calcula la mín/máx de todo el día y se usa el ícono más cercano al mediodía.
- **Favoritos case-insensitive:** "Bogotá" y "bogotá" no se duplican; máximo 10.

## Instalación local

```bash
git clone https://github.com/ujeisson-alt/weathernow-app.git
cd weathernow-app
npm install
```

Creá el archivo `.env` en la raíz (podés copiar `.env.example`) con tu API Key de [OpenWeatherMap](https://home.openweathermap.org/api_keys):

```
VITE_WEATHER_API_KEY=tu_api_key_aqui
```

```bash
npm run dev      # http://localhost:5173
```

> La API Key nueva puede tardar hasta 10 minutos (a veces unas horas) en activarse. Mientras tanto la app muestra "API Key inválida".

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Revisa el código con oxlint |

## Deploy en Vercel

1. Importá el repo en [vercel.com/new](https://vercel.com/new) (framework: **Vite**, se detecta solo).
2. En **Settings → Environment Variables** agregá `VITE_WEATHER_API_KEY` con tu API Key.
3. Deploy. Si agregaste la variable después del primer deploy, hacé **Redeploy**.

## Testing

Pruebas manuales documentadas en [`TEST_PLAN.md`](./TEST_PLAN.md): 20 casos funcionales, responsive y de accesibilidad, con resultado y evidencia.

## Autor

**Jeisson Uribe** — QA Tester & Data Analyst en formación como desarrollador front-end
[LinkedIn](https://www.linkedin.com/in/jeisson-uribe-qa-data) · [GitHub](https://github.com/ujeisson-alt)
