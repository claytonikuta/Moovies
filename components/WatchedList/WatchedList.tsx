// components/FavouritesList/FavouritesList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Menu, Button, rem } from '@mantine/core';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import useMovieLists from '../../hooks/useMovieLists';
import styles from './WatchedList.module.css';

const WatchedList = () => {
  const {
    favourites,
    watchlist,
    addToFavourites,
    removeFromFavourites,
    addToWatchList,
    removeFromWatchList,
    addToWatched,
    removeFromWatched,
  } = useMovieLists();
  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    release_date: string;
    vote_average: number;
  }
  const isInList = (movieId: number, list: number[]) => list.includes(movieId);

  const [watched, setWatched] = useState<Movie[]>([]);
  const watchedIds = watched.map((movie) => movie.id);

  useEffect(() => {
    const fetchWatched = async () => {
      try {
        const response = await axios.get('/api/watched');
        setWatched(response.data);
      } catch (error) {
        console.error('An error occurred while fetching watched:', error);
      }
    };

    fetchWatched();
  }, []);

  return (
    <div className={styles.moviesList}>
      {watched.length > 0 ? (
        watched.map((movie) => (
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
                    <Menu.Item
                      leftSection={<IconHeart style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {
                        if (isInList(movie.id, favourites)) {
                          removeFromFavourites(movie.id);
                        } else {
                          addToFavourites(movie.id);
                        }
                      }}
                    >
                      {isInList(movie.id, favourites)
                        ? 'Remove from Favourites'
                        : 'Add to Favourites'}
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconClockPlus style={{ width: rem(14), height: rem(14) }} />}
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
                      {isInList(movie.id, watchlist) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {
                        const currentMovieId = movie.id; // Properly reference the id of the movie here

                        if (isInList(currentMovieId, watchedIds)) {
                          // Movie is already in favourites, so run code to remove it
                          removeFromWatched(currentMovieId);
                        } else {
                          // Movie is not in favourites, so run code to add it
                          addToWatched(currentMovieId);
                        }
                      }}
                    >
                      {isInList(movie.id, watchedIds) ? 'Remove from Watched' : 'Add to Watched'}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No movies in watched yet...</p>
      )}
    </div>
  );
};

export default WatchedList;
