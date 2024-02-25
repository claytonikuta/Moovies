// components/SearchList/SearchList.tsx
import { useEffect, useState, useContext } from 'react';
import { Menu, Button, rem, ButtonProps } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import { signIn, useSession } from 'next-auth/react';
import GoogleIcon from './GoogleIcon';
import useMovieLists from '../../hooks/useMovieLists';
import { SearchContext } from '../../context/SearchContext';
import styles from './SearchList.module.css';

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
  const [isLoading, setIsLoading] = useState(true);
  const { query } = useContext(SearchContext);

  const isInList = (movieId: number, list: number[]) => {
    return list.includes(movieId);
  };

  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    release_date: string;
    vote_average: number;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const { status } = useSession();

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
        if (isMounted) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    fetchMovies();

    return () => {
      isMounted = false; // Clean up flag on unmount
    };
  }, [loadData, query]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.moviesMain}>
      <div className={styles.moviesList}>
        {movies.map((movie: Movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <h2>{movie.title}</h2>
            <div className={styles.posterWrapper}>
              <Link href={`/movie/${movie.id}`} passHref>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <img src="path/to/your/placeholder/image.jpg" alt="placeholder" />
                )}
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
                          {
                            // @ts-ignore
                            isInList(movie.id, favourites)
                              ? 'Remove from Favourites'
                              : 'Add to Favourites'
                          }
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconClockPlus style={{ width: rem(14), height: rem(14) }} />
                          }
                          onClick={() => {
                            const currentMovieId = movie.id; // Properly reference the id of the movie here
                            // @ts-ignore
                            if (isInList(currentMovieId, watchlist)) {
                              // Movie is already in favourites, so run code to remove it
                              removeFromWatchList(currentMovieId);
                            } else {
                              // Movie is not in favourites, so run code to add it
                              addToWatchList(currentMovieId);
                            }
                          }}
                        >
                          {
                            // @ts-ignore
                            isInList(movie.id, watchlist)
                              ? 'Remove from Watchlist'
                              : 'Add to Watchlist'
                          }
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => {
                            const currentMovieId = movie.id; // Properly reference the id of the movie here
                            // @ts-ignore
                            if (isInList(currentMovieId, watched)) {
                              // Movie is already in favourites, so run code to remove it
                              removeFromWatched(currentMovieId);
                            } else {
                              // Movie is not in favourites, so run code to add it
                              addToWatched(currentMovieId);
                            }
                          }}
                        >
                          {
                            // @ts-ignore
                            isInList(movie.id, watched) ? 'Remove from Watched' : 'Add to Watched'
                          }
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
          </div>
        ))}
      </div>
    </div>
  );
}
