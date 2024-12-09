import type { NextApiRequest, NextApiResponse } from 'next';

const GENIUS_API_URL = 'https://api.genius.com/songs/';
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try { // leaving this as fetch bc i don't want to deal with typing all the genius json res
    const response = await fetch(`${GENIUS_API_URL}${query}`, {
      headers: {
        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Genius API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
