import { connectToDatabase } from '../utils/mongodb';

export const getAllFighters = async () => {
    try {
        const { db } = await connectToDatabase();
        const fighters = await db.collection('fighters').find({}).toArray();
        return fighters;
    } catch (error) {
        console.error('Error fetching fighters:', error);
        throw new Error('Failed to fetch fighters');
    }
};

export const getFighterById = async (id) => {
    try {
        const { db } = await connectToDatabase();
        const fighter = await db.collection('fighters').findOne({ _id: id });
        return fighter;
    } catch (error) {
        console.error('Error fetching fighter by ID:', error);
        throw new Error('Failed to fetch fighter');
    }
};

export const addFighter = async (fighter) => {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('fighters').insertOne(fighter);
        return result.ops[0];
    } catch (error) {
        console.error('Error adding fighter:', error);
        throw new Error('Failed to add fighter');
    }
};

export const updateFighter = async (id, updates) => {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('fighters').updateOne({ _id: id }, { $set: updates });
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating fighter:', error);
        throw new Error('Failed to update fighter');
    }
};

export const deleteFighter = async (id) => {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('fighters').deleteOne({ _id: id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting fighter:', error);
        throw new Error('Failed to delete fighter');
    }
};


