import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/SearchBar.css';

/**
 * Formulario de búsqueda de ciudad.
 * Usa <form onSubmit> para que Enter y el botón disparen la misma acción una sola vez.
 */
function SearchBar({ onSearch, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const [hint, setHint] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    const city = inputValue.trim();
    if (city.length < 2) {
      setHint('Escribí al menos 2 letras.');
      return;
    }
    setHint('');
    onSearch(city);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-bar__field">
        <label htmlFor="city-input" className="visually-hidden">
          Buscar ciudad
        </label>
        <input
          id="city-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Buscá una ciudad… (ej: Bogotá)"
          autoComplete="off"
          maxLength={60}
          aria-describedby={hint ? 'search-hint' : undefined}
          aria-invalid={Boolean(hint)}
        />
        <button type="submit" aria-busy={isLoading} aria-label="Buscar clima de la ciudad">
          {isLoading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
      {hint && (
        <p id="search-hint" className="search-bar__hint">
          {hint}
        </p>
      )}
    </form>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SearchBar;
