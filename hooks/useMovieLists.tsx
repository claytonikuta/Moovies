// hooks/useMovieLists.tsx

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useMovieLists() {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [watched, setWatched] = useState<number[]>([]);

  interface Movie {
    _id: string; // Use the correct property name and type.
    // Add other properties as needed.
  }

  // Wrap loadData in useCallback to memorize it between renders
  const loadData = useCallback(async () => {
    try {
      const [favouritesResponse, watchlistResponse, watchedResponse] = await Promise.all([
        axios.get('/api/favourites'),
        axios.get('/api/watchlist'),
        axios.get('/api/watched'),
      ]);

      // Use the map function to extract just the IDs from each movie object
      const favouritesIds = favouritesResponse.data.map((movie: Movie) => movie._id); // Use the correct identifier attribute, e.g., movie.id or movie._id
      const watchlistIds = watchlistResponse.data.map((movie: Movie) => movie._id);
      const watchedIds = watchedResponse.data.map((movie: Movie) => movie._id);

      // Log the transformed arrays of IDs
      console.log('Fetched favourites IDs:', favouritesIds);
      console.log('Fetched watchlist IDs:', watchlistIds);
      console.log('Fetched watched IDs:', watchedIds);

      // Update state with the new arrays of IDs
      setFavourites(favouritesIds);
      setWatchlist(watchlistIds);
      setWatched(watchedIds);
    } catch (error) {
      console.error('An error occurred while fetching lists.', error);
    }
  }, [setFavourites, setWatchlist, setWatched]); // Dependencies array is empty, meaning it only creates this function once

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
      if (response.status === 200) {
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
      if (response.status === 200) {
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
      if (response.status === 200) {
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
