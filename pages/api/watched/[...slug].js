import { getSession } from "next-auth/react";
import Watched from '../../../models/watched.ts';
import mongooseConnector from '../../../lib/db/mongooseConnect.ts';

export default async function handler(req, res) {
  await mongooseConnector();

  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'You must be signed in to view the protected content on this page.' });
  }

  const userId = session.user.id;
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const favorite = await Watched.create({ user: userId, movie: id });
      res.status(200).json(favorite);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const favorite = await Watched.findOneAndDelete({ user: userId, movie: id });
      if (favorite) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const favorites = await Watched.find({ user: userId });
      res.status(200).json({ favorites });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}