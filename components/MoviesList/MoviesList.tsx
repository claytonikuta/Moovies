// components/MoviesList/MoviesList.tsx
import { useEffect, useState } from 'react';
import { SegmentedControl, Menu, Button, rem, ButtonProps } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import { signIn, useSession } from 'next-auth/react';
import GoogleIcon from './GoogleIcon'; // Update the import statement
import useMovieLists from '../../hooks/useMovieLists';
import styles from './MoviesList.module.css';

const colorMap = new Map();

colorMap.set('Popular', 'grey');
colorMap.set('Top Rated', 'red');
colorMap.set('Now Playing', 'blue');
colorMap.set('Upcoming', 'violet');

export function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<GoogleIcon />} variant="default" {...props} />;
}

export default function MoviesList() {
  const {
    favourites,
    watched,
    watchlist,
    loadData,
    addToFavourites,
    removeFromFavourites,
    addToWatchList,
    removeFromWatchList,
    addToWatched,
    removeFromWatched,
  } = useMovieLists();

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
  const { status } = useSession();

  useEffect(() => {
    axios
      .get('/api/movies')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      });
    loadData();
  }, [loadData]);

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
              <Link href={`/movie/${movie.id}`} passHref>
                {' '}
                {/* Add Link component here */}
                <a>
                  {' '}
                  {/* Add an anchor tag to make the whole image clickable */}
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <img src="path/to/your/placeholder/image.jpg" alt="placeholder" />
                  )}
                </a>
              </Link>
              <div className={styles.menuWrapper}>
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <Button style={{ backgroundColor: 'rgba(0, 0, 0, 0)', padding: 0 }}>
                      <IconPlaylistAdd />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    {status === 'authenticated' ? (
                      <>
                        <Menu.Item
                          leftSection={<IconHeart style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => {
                            const currentMovieId = movie.id; // Properly reference the id of the movie here

                            if (isInList(currentMovieId, favourites)) {
                              // Movie is already in favourites, so run code to remove it
                              removeFromFavourites(currentMovieId);
                            } else {
                              // Movie is not in favourites, so run code to add it
                              addToFavourites(currentMovieId);
                            }
                          }}
                        >
                          {isInList(movie.id, favourites)
                            ? 'Remove from Favourites'
                            : 'Add to Favourites'}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconClockPlus style={{ width: rem(14), height: rem(14) }} />
                          }
                          onClick={() => {
                            const currentMovieId = movie.id; // Properly reference the id of the movie here

                            if (isInList(currentMovieId, watchlist)) {
                              // Movie is already in favourites, so run code to remove it
                              removeFromWatchList(currentMovieId);
                            } else {
                              // Movie is not in favourites, so run code to add it
                              addToWatchList(currentMovieId);
                            }
                          }}
                        >
                          {isInList(movie.id, watchlist)
                            ? 'Remove from Watchlist'
                            : 'Add to Watchlist'}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => {
                            const currentMovieId = movie.id; // Properly reference the id of the movie here

                            if (isInList(currentMovieId, watched)) {
                              // Movie is already in favourites, so run code to remove it
                              removeFromWatched(currentMovieId);
                            } else {
                              // Movie is not in favourites, so run code to add it
                              addToWatched(currentMovieId);
                            }
                          }}
                        >
                          {isInList(movie.id, watched) ? 'Remove from Watched' : 'Add to Watched'}
                        </Menu.Item>
                      </>
                    ) : (
                      <Menu.Item>
                        <GoogleButton
                          style={{ marginRight: '20px' }}
                          onClick={() => {
                            signIn('google', { callbackUrl: window.location.origin });
                          }}
                        >
                          Sign In / Register
                        </GoogleButton>
                      </Menu.Item>
                    )}
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
