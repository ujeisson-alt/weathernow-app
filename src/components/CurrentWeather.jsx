import PropTypes from 'prop-types';
import { getIconUrl } from '../services/weatherService';
import { capitalize, formatTemp, formatLocalTime, msToKmh } from '../utils/format';
import '../styles/components/CurrentWeather.css';

/** Tarjeta principal con el clima actual de la ciudad buscada. */
function CurrentWeather({ data, onToggleFavorite, isFavorite }) {
  const { name, sys, main, wind, weather, dt, timezone } = data;
  const condition = weather[0];

  return (
    <section className="current-weather card" aria-labelledby="current-title">
      <header className="current-weather__header">
        <div>
          <h2 id="current-title">
            {name}, {sys.country}
          </h2>
          <p className="current-weather__time">
            Hora local {formatLocalTime(dt, timezone)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(name)}
          className={`btn-favorite${isFavorite ? ' is-active' : ''}`}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
        >
          <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
          {isFavorite ? 'Guardada' : 'Favorito'}
        </button>
      </header>

      <div className="current-weather__main">
        <img src={getIconUrl(condition.icon)} alt={condition.description} width="100" height="100" />
        <div>
          <p className="current-weather__temp">{formatTemp(main.temp)}C</p>
          <p className="current-weather__desc">{capitalize(condition.description)}</p>
        </div>
      </div>

      <dl className="current-weather__details">
        <div>
          <dt>Sensación</dt>
          <dd>{formatTemp(main.feels_like)}C</dd>
        </div>
        <div>
          <dt>Humedad</dt>
          <dd>{main.humidity}%</dd>
        </div>
        <div>
          <dt>Viento</dt>
          <dd>{msToKmh(wind.speed)} km/h</dd>
        </div>
        <div>
          <dt>Mín / Máx</dt>
          <dd>
            {formatTemp(main.temp_min)} / {formatTemp(main.temp_max)}
          </dd>
        </div>
      </dl>
    </section>
  );
}

CurrentWeather.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dt: PropTypes.number.isRequired,
    timezone: PropTypes.number.isRequired,
    sys: PropTypes.shape({ country: PropTypes.string }).isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      temp_min: PropTypes.number.isRequired,
      temp_max: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({ speed: PropTypes.number.isRequired }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({ icon: PropTypes.string, description: PropTypes.string })
    ).isRequired,
  }).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default CurrentWeather;
