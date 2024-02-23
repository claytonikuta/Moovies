// hooks/useMovieLists.tsx

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useMovieLists() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);

  // Wrap loadData in useCallback to memoize it between renders
  const loadData = useCallback(async () => {
    try {
      const [favResponse, watchlistResponse, watchedResponse] = await Promise.all([
        axios.get('/api/favourites'),
        axios.get('/api/watchlist'),
        axios.get('/api/watched'),
      ]);

      setFavorites(favResponse.data.map((fav: any) => fav.movieId));
      setWatchlist(watchlistResponse.data.map((wl: any) => wl.movieId));
      setWatched(watchedResponse.data.map((w: any) => w.movieId));
    } catch (error) {
      console.error('An error occurred while fetching lists.', error);
    }
  }, []); // Dependencies array is empty, meaning it only creates this function once

  // Call loadData on mount and any time loadData dependency updates
  useEffect(() => {
    loadData();
  }, [loadData]);

  return { favorites, watchlist, watched, loadData };
}
