// components/MoivesList/MoviesList.tsx
import { useEffect, useState } from 'react';
import { SegmentedControl, Menu, Button, rem } from '@mantine/core';
import axios from 'axios';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import useMovieLists from '../../hooks/useMovieLists';
import styles from './MoviesList.module.css';

const colorMap = new Map();

colorMap.set('Popular', 'grey');
colorMap.set('Top Rated', 'red');
colorMap.set('Now Playing', 'blue');
colorMap.set('Upcoming', 'violet');

export default function MoviesList() {
  const { favorites, watchlist, watched, loadData } = useMovieLists();

  const isInList = (movieId: number, list: number[]) => list.includes(movieId);

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
    axios
      .get('/api/movies')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      });
  }, []);

  const handleSelected = (value: string) => {
    setSelected(value);
    axios
      .get(`/api/movies/?listType=${value}`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
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

  // const toggleFavorite = async (movieId: number) => {
  //   try {
  //     await axios.post(`/api/favourites/${movieId}`);
  //     loadData();
  //   } catch (error) {
  //     console.error('An error occurred while updating favorites.', error);
  //   }
  // };

  const addToFavourites = async (movieId: number) => {
    try {
      const response = await axios.post('/api/favourites/add', { movieId });
      // Assuming your POST endpoint returns the updated list or a success confirmation
      if (response.status === 200) {
        loadData();
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
      // Handle error, maybe inform the user
    }
  };

  const removeFromFavourites = async (movieId: number) => {
    try {
      const response = await axios.delete(`/api/favourites/${movieId}`);
      if (response.status === 204) {
        loadData();
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Handle error, maybe inform the user
    }
  };

  const toggleWatched = async (movieId: number) => {
    try {
      await axios.post(`/api/watched/${movieId}`);
      loadData();
    } catch (error) {
      console.error('An error occurred while updating watched.', error);
    }
  };

  const toggleWatchList = async (movieId: number) => {
    try {
      await axios.post(`/api/watchlist/${movieId}`);
      loadData();
    } catch (error) {
      console.error('An error occurred while updating watchlist.', error);
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
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <img src="path/to/your/placeholder/image.jpg" alt="placeholder" />
              )}
              <div className={styles.menuWrapper}>
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <Button style={{ backgroundColor: 'rgba(0, 0, 0, 0)', padding: 0 }}>
                      <IconPlaylistAdd />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <Menu.Item
                      leftSection={<IconHeart style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {
                        const currentMovieId = movie.id; // Properly reference the id of the movie here

                        if (isInList(currentMovieId, favorites)) {
                          // Movie is already in favorites, so run code to remove it
                          removeFromFavourites(currentMovieId);
                        } else {
                          // Movie is not in favorites, so run code to add it
                          addToFavourites(currentMovieId);
                        }
                      }}
                    >
                      {isInList(movie.id, favorites) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconClockPlus style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => toggleWatchList(movie.id)}
                    >
                      {isInList(movie.id, watchlist) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => toggleWatched(movie.id)}
                    >
                      {isInList(movie.id, watched) ? 'Remove from Watched' : 'Add to Watched'}
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
