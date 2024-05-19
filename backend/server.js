const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { exec } = require('child_process');
const fighterRoutes = require('./routes/fighters');
const runScriptRoutes = require('./routes/runScripts');
const checkFileConsistency = require('./scripts/check_file_consistency');
const importData = require('./scripts/import_data');
const debug = require('debug')('server');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/fighters', fighterRoutes);
app.use('/api/run-script', runScriptRoutes);

const cleanDataScript = path.resolve(__dirname, './scripts/clean_data.py');

async function connectToDatabase() {
    debug('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI);
        debug('Connected to MongoDB');
    } catch (err) {
        debug('Failed to connect to MongoDB:', err.message);
        throw new Error('Database connection failed');
    }
}

async function processData() {
    debug('Checking file consistency...');
    try {
        const isFileConsistent = await checkFileConsistency();
        if (!isFileConsistent) {
            debug('File is not consistent. Running clean data script...');
            return new Promise((resolve, reject) => {
                exec(`python ${cleanDataScript}`, async (error, stdout, stderr) => {
                    if (error) {
                        debug(`Error cleaning data: ${error.message}`);
                        return reject(error);
                    }
                    if (stderr) {
                        debug(`Clean data script stderr: ${stderr}`);
                        return reject(new Error(stderr));
                    }
                    debug('Clean data script completed');
                    try {
                        await importData();
                        debug('Data imported successfully after cleaning.');
                        resolve();
                    } catch (importErr) {
                        debug('Error importing data:', importErr.message);
                        reject(importErr);
                    }
                });
            });
        } else {
            debug('File is consistent. Importing data...');
            await importData();
            debug('Data imported successfully.');
        }
    } catch (err) {
        debug('Error processing data:', err.message);
        throw new Error('Data processing failed');
    }
}

async function initializeServer(port) {
    debug('Initializing server...');
    try {
        await connectToDatabase();
        await processData();
        app.listen(port, () => {
            debug(`Server running on port ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                debug(`Port ${port} is already in use, trying another port...`);
                if (port < 65535) {
                    initializeServer(port + 1);
                } else {
                    debug('No available ports in range 8001-65535.');
                    process.exit(1);
                }
            } else {
                throw err;
            }
        });
    } catch (err) {
        debug('Failed to initialize server:', err.message);
        process.exit(1); // Exit the process if initialization fails
    }
}

initializeServer(PORT).then(() => {
    debug('Initialization process completed.');
}).catch(err => {
    debug('Initialization process failed:', err.message);
});














