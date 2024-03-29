// pages/api/favourites/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Watched } from '../../../models/watched';
import mongooseConnector from '../../../lib/db/mongooseConnect';

const API_KEY = process.env.MOVIEDB_API_KEY;

const fetchMovieDetails = async (movieId: string) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch movie details for ID: ${movieId}`, error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongooseConnector();

  const session = await getSession({ req });

  if (!session || !session.user) {
    res.status(401).json({ error: 'You must be signed in to access this endpoint.' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const userId = session.user.id;
      const watched = await Watched.find({ user: userId });

      const movieDetailsPromises = watched.map((wat) => fetchMovieDetails(wat.movieId));
      const movieDetails = await Promise.all(movieDetailsPromises);

      const validMovieDetails = movieDetails.filter(Boolean);

      res.status(200).json(validMovieDetails);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
