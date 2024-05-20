require('dotenv').config();
const debug = require('debug');
debug.enable('server');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debugLog = debug('server');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pastel_wager';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});

// Use fight data routes
const fightDataRoutes = require('./routes/fightData');
app.use('/api/fightData', fightDataRoutes);

async function connectToDatabase() {
    debugLog('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        debugLog('Connected to MongoDB');
    } catch (err) {
        debugLog('Failed to connect to MongoDB:', err.message);
        throw new Error('Database connection failed');
    }
}

async function startServer(port) {
    debugLog(`Attempting to start server on port ${port}...`);
    app.listen(port, () => {
        debugLog(`Server running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            debugLog(`Port ${port} is already in use.`);
            if (port < 65535) {
                debugLog(`Trying another port: ${port + 1}`);
                startServer(port + 1);
            } else {
                debugLog('No available ports in range 8001-65535.');
                process.exit(1);
            }
        } else {
            debugLog(`Server encountered an error: ${err.message}`);
            throw err;
        }
    });
}

async function initialize() {
    debugLog('Initializing server...');
    try {
        await connectToDatabase();
        debugLog('Database connection established.');
        await startServer(PORT);
        debugLog('Server initialization completed.');
    } catch (err) {
        debugLog('Failed to initialize server:', err.message);
        process.exit(1); // Exit the process if initialization fails
    }
}

// Start initialization
initialize().then(() => {
    debugLog('Initialization process completed.');
}).catch(err => {
    debugLog('Initialization process failed:', err.message);
});

module.exports = app;
