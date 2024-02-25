// components/FavouritesList/FavouritesList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Menu, Button, rem } from '@mantine/core';
import { IconChecks, IconClockPlus, IconPlaylistAdd, IconHeart } from '@tabler/icons-react';
import useMovieLists from '../../hooks/useMovieLists';
import styles from './FavouritesList.module.css';

const FavouritesList = () => {
  const {
    favourites,
    watched,
    watchlist,
    addToFavourites,
    removeFromFavourites,
    addToWatchList,
    removeFromWatchList,
    addToWatched,
    loadData,
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

  const [isLoading, setIsLoading] = useState(true);
  const [favouritesList, setFavourites] = useState<Movie[]>([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/favourites')
      .then((response) => {
        setFavourites(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('An error occurred while fetching data from the MovieDB API', error);
        setIsLoading(false);
      });
    loadData().then(() => {
      setIsLoading(false);
    });
  }, [loadData]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.moviesList}>
      {favouritesList.length > 0 ? (
        favouritesList.map((movie) => (
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
                        const currentMovieId = movie.id;
                        if (favourites.includes(currentMovieId)) {
                          removeFromFavourites(currentMovieId);
                          setFavourites((prevFavourites) =>
                            prevFavourites.filter((fav) => fav.id !== currentMovieId)
                          );
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
                      leftSection={<IconClockPlus style={{ width: rem(14), height: rem(14) }} />}
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
                      leftSection={<IconChecks style={{ width: rem(14), height: rem(14) }} />}
                      onClick={() => {
                        const currentMovieId = movie.id;
                        if (watched.includes(currentMovieId)) {
                          removeFromWatched(currentMovieId);
                        } else {
                          addToWatched(currentMovieId);
                        }
                      }}
                    >
                      {watched.includes(movie.id) ? 'Remove from Watched' : 'Add to Watched'}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No movies in favourites yet...</p>
      )}
    </div>
  );
};

export default FavouritesList;
