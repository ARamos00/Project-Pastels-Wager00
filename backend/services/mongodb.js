const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project-pastels-wager';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connect() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('project-pastels-wager');
}

module.exports = { connect };






