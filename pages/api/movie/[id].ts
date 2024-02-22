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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ movie: Movie; trailer: Trailer } | { error: string }>
) {
  const { id } = req.query;

  try {
    // Fetch movie details
    const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: 'b137b0ed3bd802c92e40d0c241b6751c',
      },
    });
    const movieData = movieResponse.data;

    // Fetch movie trailers
    const trailersResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
      params: {
        api_key: 'b137b0ed3bd802c92e40d0c241b6751c',
      },
    });
    const trailersData = trailersResponse.data.results;

    // Get the first trailer (assuming there might be multiple trailers)
    const trailer = trailersData.length > 0 ? trailersData[0] : null;

    const movie: Movie = {
      id: movieData.id,
      title: movieData.title,
      overview: movieData.overview,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      vote_average: movieData.vote_average,
    };

    res.status(200).json({ movie, trailer });
  } catch (error) {
    console.error('An error occurred while fetching movie details:', error);
    res.status(500).json({ error: 'An error occurred while fetching movie details' });
  }
}
