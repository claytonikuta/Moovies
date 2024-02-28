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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieData[] | { error: string }>
) {
  const searchQuery = req.query.search as string | undefined;
  const page = parseInt(req.query.page as string, 10) || 1;

  if (req.method === 'GET') {
    const listType = req.query.listType || 'Popular';

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 4);

    const params: Record<string, any> = {
      api_key: API_KEY,
      language: 'en-US',
      page: page,
    };
    let apiUrl;
    if (searchQuery) {
      apiUrl = 'https://api.themoviedb.org/3/search/movie';
      params['query'] = searchQuery;
    } else {
      switch (listType) {
        case 'Popular':
          apiUrl = 'https://api.themoviedb.org/3/movie/popular';
          params['region'] = 'US';
          params['language'] = 'en-US';
          params['sort_by'] = 'popularity.desc';
          break;
        case 'Top Rated':
          apiUrl = 'https://api.themoviedb.org/3/movie/top_rated';
          params['region'] = 'US';
          params['language'] = 'en-US';
          params['sort_by'] = 'popularity.desc';
          break;
        case 'Upcoming':
          apiUrl = 'https://api.themoviedb.org/3/movie/upcoming';
          params['region'] = 'US';
          params['language'] = 'en-US';
          params['sort_by'] = 'popularity.desc';
          break;
        case 'Now Playing':
          apiUrl = 'https://api.themoviedb.org/3/movie/now_playing';
          params['region'] = 'US';
          params['language'] = 'en-US';
          params['sort_by'] = 'popularity.desc';
          break;
        default:
          apiUrl = 'https://api.themoviedb.org/3/movie/popular';
      }
    }
    params['page'] = page;

    try {
      const allMovies: MovieData[] = [];
      let totalPages = 1;
      do {
        const { data } = await axios.get(apiUrl, { params });
        allMovies.push(...data.results);

        totalPages = data.total_pages;
        params.page += 1;
      } while (allMovies.length < 24 && params.page <= totalPages && params.page <= page + 1);

      res.status(200).json(allMovies.slice(0, 24));
    } catch (error) {
      console.error('Error fetching data from the MovieDB API:', error);
      res.status(500).json({ error: 'An error occurred while fetching data from the MovieDB API' });
    }
  } else {
    res.status(405).json({ error: 'Invalid request method' });
  }
}
