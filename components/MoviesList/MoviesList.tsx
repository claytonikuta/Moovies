import { useEffect, useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import axios from 'axios';
import styles from './MoviesList.module.css';

const colorMap = new Map();

colorMap.set('Popular', 'black');
colorMap.set('Top Rated', 'red');
colorMap.set('Now Playing', 'blue');
colorMap.set('Upcoming', 'violet');

export default function MoviesList() {
  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string; // The '?' means this property is optional
    release_date: string;
    vote_average: number;
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
    <div className={styles.moviesMain}>
      <div className={styles.moviesSegment}>
        <SegmentedControl className={styles.segmentedControl} onChange={handleSelected} color={colorMap.get(selected)} data={['Popular', 'Top Rated', 'Now Playing', 'Upcoming']} />
      </div>
      <div className={styles.moviesList}>
        {movies.map((movie: Movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <h2>{movie.title}</h2>
            {movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            ) : (
              <img src="path/to/your/placeholder/image.jpg" alt="placeholder" />
            )}
            <p>Release date: {movie.release_date}</p>
            <p>Rating: {Math.round(movie.vote_average * 10)}%</p>
            <p>{movie.overview}</p>
            {/* <button onClick={() => handleMoreInfo(movie.id)}>More Info</button> */}
          </div>
        ))}
      </div>
    </div>
  );
  // const handleMoreInfo = (id: number) => {
  //   // Navigate to the individual movie page
  //   // This depends on how you've set up your routing
  // };
}
