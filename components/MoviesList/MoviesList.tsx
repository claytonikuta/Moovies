// components/MoviesList/MoviesList.tsx
import { useEffect, useState } from 'react';
import {
  TextInput,
  SegmentedControl,
  Menu,
  Button,
  rem,
  ButtonProps,
  CloseButton,
} from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import { signIn, useSession } from 'next-auth/react';
import { useDebouncedValue } from '@mantine/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import GoogleIcon from './GoogleIcon';
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
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

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
    let isMounted = true;

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/movies');
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
      isMounted = false;
    };
  }, [loadData]);

  const handleSelected = async (value: string) => {
    if (value !== selected) {
      setSearchQuery('');
      setSelected(value);
      setPage(1);
      setHasMore(true);
      setIsSwitching(true);

      try {
        const response = await axios.get(`/api/movies/?listType=${value}&page=1`);
        setMovies(response.data);
      } catch (error) {
        console.error('An error occurred while fetching data from the MovieDB API', error);
      } finally {
        setIsSwitching(false);
      }
    }
  };

  useEffect(() => {
    handleSelected(selected);
    loadData();
  }, []);

  const handleMoreInfo = (id: number) => {
    if (expandedMovieId === id) {
      setExpandedMovieId(null);
    } else {
      setExpandedMovieId(id);
    }
  };

  const fetchMoreMovies = async () => {
    try {
      const nextPage = page + 1;
      const response = await axios.get('/api/movies/', {
        params: {
          ...(searchQuery && { search: searchQuery }),
          listType: selected,
          page: nextPage,
        },
      });
      if (response.data.length) {
        setMovies((currentMovies) => [...currentMovies, ...response.data]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch more movies', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSelected('');
    try {
      setIsSwitching(true);
      const response = await axios.get(`/api/movies/?search=${query}`);
      setMovies(response.data);
    } catch (error) {
      console.error('An error occurred while searching for movies', error);
    } finally {
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.moviesMain}>
      <div className={styles.moviesSegment}>
        <div className={styles.searchWrapper}>
          <TextInput
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            rightSection={
              searchQuery && (
                <CloseButton
                  onClick={() => {
                    setSearchQuery('');
                    handleSelected('Popular');
                  }}
                  title="Clear search"
                  size={16}
                />
              )
            }
            rightSectionWidth={42}
          />
        </div>
        <SegmentedControl
          className={styles.segmentedControl}
          value={searchQuery ? '' : selected}
          onChange={handleSelected}
          color={colorMap.get(selected)}
          data={['Popular', 'Top Rated', 'Now Playing', 'Upcoming']}
        />
      </div>
      {isSwitching ? (
        <div style={{ marginLeft: '10px' }}>Loading new category...</div>
      ) : movies.length > 0 ? (
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMoreMovies}
          hasMore={hasMore}
          loader={<h4 style={{ marginLeft: '10px' }}>Loading...</h4>}
          endMessage={<p>You have seen it all</p>}
        >
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
                      <img src="/PlaceHolderSmall.jpg" alt="placeholder" />
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
                              leftSection={
                                <IconHeart style={{ width: rem(14), height: rem(14) }} />
                              }
                              onClick={() => {
                                const currentMovieId = movie.id;
                                if (favourites.includes(currentMovieId)) {
                                  removeFromFavourites(currentMovieId);
                                } else {
                                  addToFavourites(currentMovieId);
                                }
                              }}
                            >
                              {favourites.includes(movie.id)
                                ? 'Remove from Favourites'
                                : 'Add to Favourites'}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={
                                <IconClockPlus style={{ width: rem(14), height: rem(14) }} />
                              }
                              onClick={() => {
                                const currentMovieId = movie.id;
                                if (watchlist.includes(currentMovieId)) {
                                  removeFromWatchList(currentMovieId);
                                } else {
                                  addToWatchList(currentMovieId);
                                }
                              }}
                            >
                              {watchlist.includes(movie.id)
                                ? 'Remove from Watch List'
                                : 'Add to Watch List'}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={
                                <IconChecks style={{ width: rem(14), height: rem(14) }} />
                              }
                              onClick={() => {
                                const currentMovieId = movie.id;
                                if (watched.includes(currentMovieId)) {
                                  removeFromWatched(currentMovieId);
                                } else {
                                  addToWatched(currentMovieId);
                                }
                              }}
                            >
                              {watched.includes(movie.id)
                                ? 'Remove from Watched'
                                : 'Add to Watched'}
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
        </InfiniteScroll>
      ) : (
        <div style={{ marginLeft: '10px' }}>No movies found. Try a different search.</div>
      )}
    </div>
  );
}
