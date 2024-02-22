import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const MOVIEDB_API_URL = 'https://api.themoviedb.org/3/discover/movie';
const API_KEY = 'b137b0ed3bd802c92e40d0c241b6751c'

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

    axios.get(apiUrl, {
      params: {
        api_key: API_KEY,
        page: 1,
      },
    })
    .then(response => {
      const data = response.data.results.slice(0, 12);
      res.status(200).json(data)
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while fetching data from the MovieDB API' })
    })
  } else {
    res.status(405).json({ error: 'Invalid request method' })
  }
}