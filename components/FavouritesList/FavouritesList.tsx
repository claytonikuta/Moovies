import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FavouritesList.module.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
}

const FavouritesList: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const response = await axios.get('/api/favourites'); // Adjust API endpoint as needed
        setFavoriteMovies(response.data.favorites);
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching favorite movies.');
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, []);

  const handleRemoveFavorite = async (movieId: number) => {
    try {
      // Make API call to remove movie from favorites
      await axios.delete(`/api/favourites/${movieId}`); // Adjust API endpoint as needed
      // Update local state to reflect the removal
      setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      setError('An error occurred while removing the movie from favorites.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.favouritesList}>
      <h2>Favorite Movies</h2>
      {favoriteMovies.length === 0 ? (
        <p>No favorite movies added yet.</p>
      ) : (
        favoriteMovies.map(movie => (
          <div key={movie.id} className={styles.movieItem}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div>
              <h3>{movie.title}</h3>
              <p>Release Date: {movie.release_date}</p>
              <p>Rating: {Math.round(movie.vote_average * 10)}%</p>
              <p>{movie.overview}</p>
              <button onClick={() => handleRemoveFavorite(movie.id)}>Remove from Favorites</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FavouritesList;
