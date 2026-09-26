import { useState, useRef, useCallback } from 'react';
import { getCurrentWeather, getForecast } from './services/weatherService';
import useFavorites from './hooks/useFavorites';
import SearchBar from './components/SearchBar';
import FavoritesList from './components/FavoritesList';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import StatusMessage from './components/StatusMessage';

/**
 * Componente raíz: guarda el estado principal de la app
 * (datos del clima, carga, error) y coordina a los componentes hijos.
 */
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCity, setLastCity] = useState('');
  const { favorites, removeFavorite, isFavorite, toggleFavorite } = useFavorites();

  // Cancela la búsqueda anterior si el usuario busca otra ciudad antes de que termine
  const controllerRef = useRef(null);

  const handleSearch = useCallback(async (city) => {
    if (!city?.trim()) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLastCity(city);
    setIsLoading(true);
    setError(null);

    try {
      // Promise.all: ambas llamadas en paralelo (≈ el doble de rápido)
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(city, controller.signal),
        getForecast(city, controller.signal),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      if (err.name === 'AbortError') return; // búsqueda reemplazada por una más nueva
      setWeatherData(null);
      setForecastData([]);
      setError(err.message);
    } finally {
      if (controllerRef.current === controller) setIsLoading(false);
    }
  }, []);

  let content;
  if (isLoading) {
    content = <StatusMessage type="loading" />;
  } else if (error) {
    content = <StatusMessage type="error" message={error} onRetry={() => handleSearch(lastCity)} />;
  } else if (weatherData) {
    content = (
      <>
        <CurrentWeather
          data={weatherData}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(weatherData.name)}
        />
        <ForecastList forecasts={forecastData} />
      </>
    );
  } else {
    content = <StatusMessage type="empty" />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span aria-hidden="true">⛅ </span>WeatherNow
        </h1>
        <p>Clima en tiempo real · by SkyPulse</p>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <FavoritesList
          favorites={favorites}
          onSelectFavorite={handleSearch}
          onRemoveFavorite={removeFavorite}
          activeCity={weatherData?.name}
        />
        <div className="results" aria-live="polite">
          {content}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Datos de{' '}
          <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
            OpenWeatherMap
          </a>{' '}
          · Desarrollado por{' '}
          <a href="https://github.com/ujeisson-alt" target="_blank" rel="noopener noreferrer">
            Jeisson Uribe
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
