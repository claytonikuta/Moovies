// pages/api/movie/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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
  type: string;
}

interface Genre {
  id: string;
  key: string;
}

interface ApiVideoResult {
  id: string;
  key: string;
  type: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ movie: Movie; trailers: Trailer[]; genres: Genre[] } | { error: string }>
) {
  const { id } = req.query;

  try {
    const [movieResponse, trailersResponse] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: { api_key: process.env.MOVIEDB_API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
        params: { api_key: process.env.MOVIEDB_API_KEY },
      }),
    ]);

    const movie = movieResponse.data;
    const trailers = trailersResponse.data.results.filter(
      (trailer: ApiVideoResult) => trailer.type === 'Trailer'
    );
    res.status(200).json({ movie, trailers, genres: movie.genres });
  } catch (error) {
    console.error('An error occurred while fetching the movie details:', error);
    res.status(500).json({ error: 'An error occurred while fetching the movie details' });
  }
}
