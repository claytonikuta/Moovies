// pages/api/movies.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_KEY = process.env.MOVIEDB_API_KEY;

type MovieData = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieData[] | { error: string }>
) {
  if (req.method === 'GET') {
    const listType = req.query.listType || 'Popular'; // Default to 'popular' if no listType is specified

    let apiUrl;
    switch (listType) {
      case 'Popular':
        apiUrl = 'https://api.themoviedb.org/3/movie/popular';
        console.log('A');
        break;
      case 'Top Rated':
        apiUrl = 'https://api.themoviedb.org/3/movie/top_rated';
        console.log('B');
        break;
      case 'Now Playing':
        apiUrl = 'https://api.themoviedb.org/3/movie/now_playing';
        console.log('C');
        break;
      case 'Upcoming':
        apiUrl = 'https://api.themoviedb.org/3/movie/upcoming';
        console.log('D');
        break;
      default:
        apiUrl = 'https://api.themoviedb.org/3/movie/popular';
    }

    axios
      .get(apiUrl, {
        params: {
          api_key: API_KEY,
          page: 1,
        },
      })
      .then((response) => {
        const data = response.data.results.slice(0, 12);
        res.status(200).json(data);
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'An error occurred while fetching data from the MovieDB API' });
      });
  } else {
    res.status(405).json({ error: 'Invalid request method' });
  }
}
