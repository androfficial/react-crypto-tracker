import { useEffect, useState } from 'react';

import { LS_FAVORITES_KEY } from '@/constants/constants';

export const useFavoriteCryptos = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem(LS_FAVORITES_KEY);
    return storedFavorites ? (JSON.parse(storedFavorites) as string[]) : [];
  });

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favorites));
    } else {
      localStorage.removeItem(LS_FAVORITES_KEY);
    }
  }, [favorites]);

  return { favorites, setFavorites };
};
