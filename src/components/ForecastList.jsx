import PropTypes from 'prop-types';
import ForecastCard from './ForecastCard';
import '../styles/components/Forecast.css';

/** Contenedor del pronóstico de 5 días. */
function ForecastList({ forecasts }) {
  if (forecasts.length === 0) return null;

  return (
    <section className="forecast-list" aria-labelledby="forecast-title">
      <h3 id="forecast-title">Pronóstico 5 días</h3>
      <ul className="forecast-grid">
        {forecasts.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </ul>
    </section>
  );
}

ForecastList.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ForecastList;
