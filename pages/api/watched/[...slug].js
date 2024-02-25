import { getSession } from 'next-auth/react';
import { Watched } from '../../../models/watched.ts';
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
  const movieId = req.query.slug[0];

  if (req.method === 'POST') {
    try {
      const watched = await Watched.create({ user: userId, movieId: movieId });
      res.status(200).json(watched);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const watched = await Watched.findOneAndDelete({ user: userId, movieId: movieId });
      if (watched) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const watched = await Watched.find({ user: userId });
      res.status(200).json({ watched });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
