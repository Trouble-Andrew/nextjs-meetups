import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { DATABASE_URL } from '../../constants';

type ResponseData = {
  message: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(DATABASE_URL);

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne({ data });

    client.close();

    res.status(201).json({ message: 'Meetup added successfully.' });
  }
};

export default handler;
