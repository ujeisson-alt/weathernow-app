import PropTypes from 'prop-types';

/** Estados de la interfaz: cargando, error y vacío (empty state). */
function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status status--loading" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Buscando el clima…</p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="status status--error" role="alert">
        <p>
          <span aria-hidden="true">⚠️ </span>
          {message}
        </p>
        {onRetry && (
          <button type="button" className="btn-secondary" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="status status--empty">
      <p className="status__icon" aria-hidden="true">⛅</p>
      <p className="status__title">Buscá una ciudad para ver el clima</p>
      <p className="status__text">Clima actual, pronóstico de 5 días y tus ciudades favoritas.</p>
    </div>
  );
}

StatusMessage.propTypes = {
  type: PropTypes.oneOf(['loading', 'error', 'empty']).isRequired,
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default StatusMessage;
