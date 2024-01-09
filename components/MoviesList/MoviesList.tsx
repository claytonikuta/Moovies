import { useEffect, useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import axios from 'axios';
import styles from './MoviesList.module.css';

const colorMap = new Map();

colorMap.set('Popular', 'grey');
colorMap.set('Top Rated', 'red');
colorMap.set('Now Playing', 'blue');
colorMap.set('Upcoming', 'violet');

export default function MoviesList() {
  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string; // The '?' means this property is optional
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState('Popular');

  useEffect(() => {
    axios.get('/api/movies')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      });
  }, []);

  const handleSelected = (value: string) => {
    setSelected(value);
    axios.get(`/api/movies/?listType=${value}`)
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      });
  };

  return (
    <div className={styles.moviesList}>
      <SegmentedControl className={styles.segmentedControl} onChange={handleSelected} color={colorMap.get(selected)} data={['Popular', 'Top Rated', 'Now Playing', 'Upcoming']} />

      {movies.map((movie: Movie) => (
        <div key={movie.id} className="movie-card">
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          ) : (
            <p>No image available</p>
          )}
        </div>
      ))}
    </div>
  );
}
