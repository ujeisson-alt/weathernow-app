import PropTypes from 'prop-types';
import { getIconUrl } from '../services/weatherService';
import { capitalize, formatDay, formatTemp } from '../utils/format';

/** Tarjeta de un día del pronóstico. */
function ForecastCard({ day }) {
  return (
    <li className="forecast-card card">
      <p className="forecast-card__date">{formatDay(day.date)}</p>
      <img src={getIconUrl(day.icon)} alt={day.description} width="64" height="64" loading="lazy" />
      <p className="forecast-card__desc">{capitalize(day.description)}</p>
      <p className="forecast-card__temps">
        <span className="forecast-card__max" aria-label={`Máxima ${Math.round(day.max)} grados`}>
          {formatTemp(day.max)}
        </span>
        <span className="forecast-card__min" aria-label={`Mínima ${Math.round(day.min)} grados`}>
          {formatTemp(day.min)}
        </span>
      </p>
      <p className="forecast-card__pop">
        <span aria-hidden="true">💧</span> {day.pop}% lluvia
      </p>
    </li>
  );
}

ForecastCard.propTypes = {
  day: PropTypes.shape({
    date: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    pop: PropTypes.number.isRequired,
  }).isRequired,
};

export default ForecastCard;
