// hooks/useMovieLists.tsx

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useMovieLists() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);

  // Wrap loadData in useCallback to memorize it between renders
  const loadData = useCallback(async () => {
    try {
      const [favouritesResponse, watchlistResponse, watchedResponse] = await Promise.all([
        axios.get('/api/favourites'),
        axios.get('/api/watchlist'),
        axios.get('/api/watched'),
      ]);

      setFavourites(favouritesResponse.data.map((movie: any) => movie.id));
      setWatchlist(watchlistResponse.data.map((movie: any) => movie.id));
      setWatched(watchedResponse.data.map((movie: any) => movie.id));
    } catch (error) {
      console.error('An error occurred while fetching lists.', error);
    }
  }, [setFavourites, setWatchlist, setWatched]);

  const addToFavourites = async (movieId: number) => {
    try {
      const response = await axios.post(`/api/favourites/${movieId}`);
      if (response.status === 200 || response.status === 201) {
        setFavourites((prevFavourites) => [...prevFavourites, movieId]);
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
      // Handle error, maybe inform the user
    }
  };

  const removeFromFavourites = async (movieId: number) => {
    try {
      const response = await axios.delete(`/api/favourites/${movieId}`);
      if (response.status === 200 || response.status === 204) {
        setFavourites((prevFavourites) => prevFavourites.filter((id) => id !== movieId));
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
      // Handle error, maybe inform the user
    }
  };

  const addToWatched = async (movieId: number) => {
    try {
      const response = await axios.post(`/api/watched/${movieId}`);
      if (response.status === 200) {
        setWatched((prevWatched) => [...prevWatched, movieId]);
      }
    } catch (error) {
      console.error('An error occurred while updating watched.', error);
    }
  };

  const removeFromWatched = async (movieId: number) => {
    try {
      const response = await axios.delete(`/api/watched/${movieId}`);
      if (response.status === 200 || response.status === 204) {
        setWatched((prevWatched) => prevWatched.filter((id) => id !== movieId));
      }
    } catch (error) {
      console.error('An error occurred while updating watched.', error);
    }
  };

  const addToWatchList = async (movieId: number) => {
    try {
      const response = await axios.post(`/api/watchlist/${movieId}`);
      if (response.status === 200) {
        setWatchlist((prevWatchList) => [...prevWatchList, movieId]);
      }
    } catch (error) {
      console.error('An error occurred while updating watchlist.', error);
    }
  };

  const removeFromWatchList = async (movieId: number) => {
    try {
      const response = await axios.delete(`/api/watchlist/${movieId}`);
      if (response.status === 200 || response.status === 204) {
        setWatchlist((prevWatchList) => prevWatchList.filter((id) => id !== movieId));
      }
    } catch (error) {
      console.error('An error occurred while updating watchlist.', error);
    }
  };

  // Call loadData on mount and any time loadData dependency updates
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    favourites,
    watchlist,
    watched,
    loadData,
    addToFavourites,
    removeFromFavourites,
    addToWatchList,
    removeFromWatchList,
    addToWatched,
    removeFromWatched,
  };
}
