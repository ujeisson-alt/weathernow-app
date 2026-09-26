import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weathernow_favorites';
const MAX_FAVORITES = 10;

/** Lee los favoritos guardados; si localStorage falla o está corrupto, devuelve []. */
function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((c) => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

const normalize = (city) => city.trim().toLowerCase();

/**
 * Custom hook: lista de ciudades favoritas persistida en localStorage.
 * La comparación ignora mayúsculas/minúsculas para evitar duplicados
 * como "Bogotá" y "bogotá".
 */
function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  // Sincroniza con localStorage cada vez que cambia la lista
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Modo privado o almacenamiento lleno: la app sigue funcionando sin persistir
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (city) => favorites.some((c) => normalize(c) === normalize(city)),
    [favorites]
  );

  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      if (prev.some((c) => normalize(c) === normalize(city))) return prev;
      return [...prev, city].slice(-MAX_FAVORITES);
    });
  }, []);

  const removeFavorite = useCallback((city) => {
    setFavorites((prev) => prev.filter((c) => normalize(c) !== normalize(city)));
  }, []);

  const toggleFavorite = useCallback(
    (city) => (isFavorite(city) ? removeFavorite(city) : addFavorite(city)),
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}

export default useFavorites;
