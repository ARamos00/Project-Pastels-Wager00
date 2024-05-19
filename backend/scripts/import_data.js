const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Fighter = require('../models/Fighter');
const debug = require('debug')('importData');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const importData = async () => {
    const fighters = [];
    const filePath = path.resolve(__dirname, '../../data.csv');

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            fighters.push({
                name: row.name,
                age: parseInt(row.age),
                height: parseInt(row.height),
                weight: parseInt(row.weight),
                hometown: row.hometown,
                stats: {
                    wins: parseInt(row.wins),
                    losses: parseInt(row.losses),
                    draws: parseInt(row.draws),
                },
            });
        })
        .on('end', async () => {
            try {
                await Fighter.insertMany(fighters);
                debug('Data imported successfully');
                mongoose.connection.close();
            } catch (error) {
                debug('Error importing data:', error.message);
                mongoose.connection.close();
            }
        });
};

module.exports = importData;








