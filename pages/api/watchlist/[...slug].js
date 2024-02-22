import { getSession } from 'next-auth/react';
import { WatchList } from '../../../models/watchlist.ts';
import mongooseConnector from '../../../lib/db/mongooseConnect.ts';

export default async function handler(req, res) {
  await mongooseConnector();

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ error: 'You must be signed in to view the protected content on this page.' });
  }

  const userId = session.user.id;
  const movieId = req.query.slug[0]; // Here's the updated line

  if (req.method === 'POST') {
    try {
      const watchlist = await WatchList.create({ user: userId, movieId: movieId });
      res.status(200).json(watchlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const watchlist = await WatchList.findOneAndDelete({ user: userId, movieId: movieId });
      if (watchlist) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const watchlist = await WatchList.find({ user: userId });
      res.status(200).json({ watchlist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
