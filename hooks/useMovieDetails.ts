// hooks/useMovieDetails.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_MOVIEDB_API_KEY;

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
}

interface Trailer {
  id: string;
  key: string;
}

interface Genre {
  id: number;
  name: string;
}

export const useMovieDetails = (movieId: string | string[] | undefined) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      setLoading(true);

      try {
        const [movieResponse, trailersResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: API_KEY,
            },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            params: {
              api_key: API_KEY,
            },
          }),
        ]);

        setMovie(movieResponse.data);
        setTrailers(trailersResponse.data.results.filter((video: any) => video.type === 'Trailer'));
        setGenres(movieResponse.data.genres);
      } catch (error) {
        console.error('An error occurred while fetching movie details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { movie, trailers, loading, genres };
};
