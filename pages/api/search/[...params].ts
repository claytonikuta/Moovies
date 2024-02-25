// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.MOVIEDB_API_KEY;
  const language = 'en-US';
  const includeAdult = false;
  const page = 1;
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: 'Query term is required' });
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}&include_adult=${includeAdult}&page=${page}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.results);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
