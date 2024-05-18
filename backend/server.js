const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('./services/mongodb');
const fighterRoutes = require('./routes/fighters');
const runScriptRoutes = require('./routes/runScripts');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/fighters', fighterRoutes);
app.use('/api/run-script', runScriptRoutes);

const PORT = process.env.PORT || 8001;

mongoose.connect().then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});



















