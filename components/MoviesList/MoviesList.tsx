import { useEffect, useState } from 'react';
import { SegmentedControl, Menu, Button, Text, rem } from '@mantine/core';
import axios from 'axios';
import {
  IconChecks,
  IconClockPlus,
  IconPlaylistAdd,
  IconHeart,
} from '@tabler/icons-react';
import styles from './MoviesList.module.css';

const colorMap = new Map();

colorMap.set('Popular', 'grey');
colorMap.set('Top Rated', 'red');
colorMap.set('Now Playing', 'blue');
colorMap.set('Upcoming', 'violet');

const toggleFavorite = async (movieId) => {
  try {
    await axios.post(`/api/favourites/${movieId}`);
    // Update UI to reflect favorite status – for demonstration it requires additional implementation details
  } catch (error) {
    console.error('An error occurred while updating favorites.', error);
  }
};

export default function MoviesList() {
  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    release_date: string;
    vote_average: number;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState('Popular');
  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null);

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

  const handleMoreInfo = (id: number) => {
    if (expandedMovieId === id) {
      setExpandedMovieId(null);
    } else {
      setExpandedMovieId(id);
    }
  };

  return (
    <div className={styles.moviesMain}>
      <div className={styles.moviesSegment}>
        <SegmentedControl
          className={styles.segmentedControl}
          onChange={handleSelected}
          color={colorMap.get(selected)}
          data={['Popular', 'Top Rated', 'Now Playing', 'Upcoming']}
        />
      </div>
      <div className={styles.moviesList}>
        {movies.map((movie: Movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <h2>{movie.title}</h2>
            <div className={styles.posterWrapper}>
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              ) : (
                <img src="path/to/your/placeholder/image.jpg" alt="placeholder" />
              )}
              <div className={styles.menuWrapper}>
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <Button style={{ backgroundColor: 'rgba(0, 0, 0, 0)', padding: 0 }}><IconPlaylistAdd /></Button>              
                  </Menu.Target>
                  <Menu.Dropdown style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <Menu.Item
                      leftSection={<IconHeart style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => toggleFavorite(movie.id)}
                    >
                        Add to Favourites
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconClockPlus style={{ width: rem(14), height: rem(14) }} />}
                    >
                      Add to Watchlist
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                    >
                      Add to Watched
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
            <p>Release date: {movie.release_date}</p>
            <p>Rating: {Math.round(movie.vote_average * 10)}%</p>
            <p>
              {expandedMovieId === movie.id || movie.overview.length <= 100
                ? movie.overview
                : `${movie.overview.slice(0, 100)}...`}
            </p>
            <button type="button" onClick={() => handleMoreInfo(movie.id)}>
              {expandedMovieId === movie.id ? 'Less Info' : 'More Info'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
