import PropTypes from 'prop-types';
import '../styles/components/FavoritesList.css';

/** Chips de ciudades favoritas: clic para buscar, × para quitar. */
function FavoritesList({ favorites, onSelectFavorite, onRemoveFavorite, activeCity }) {
  if (favorites.length === 0) return null;

  return (
    <section className="favorites-list" aria-labelledby="favorites-title">
      <h3 id="favorites-title">Ciudades favoritas</h3>
      <ul className="favorites-chips">
        {favorites.map((city) => {
          const isActive = activeCity?.toLowerCase() === city.toLowerCase();
          return (
            <li key={city} className={`favorite-chip${isActive ? ' is-active' : ''}`}>
              <button
                type="button"
                className="chip-label"
                onClick={() => onSelectFavorite(city)}
                aria-label={`Ver clima de ${city}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {city}
              </button>
              <button
                type="button"
                className="chip-remove"
                onClick={() => onRemoveFavorite(city)}
                aria-label={`Quitar ${city} de favoritos`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

FavoritesList.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
  activeCity: PropTypes.string,
};

export default FavoritesList;
