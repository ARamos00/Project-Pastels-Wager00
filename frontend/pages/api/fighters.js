// api/fighters.js

import { connectToDatabase } from '../../services/mongodb.js';

const handler = async (req, res) => {
    try {
        console.log('Connecting to database...');
        const { db } = await connectToDatabase();
        console.log('Connected to database, fetching fighters...');
        const fighters = await db.collection('fighters').find({}).toArray();
        console.log('Fetched fighters:', fighters);
        res.status(200).json({ fighters });
    } catch (error) {
        console.error('Error fetching fighters:', error);
        res.status(500).json({ error: 'Failed to fetch fighters' });
    }
};

export default handler;




