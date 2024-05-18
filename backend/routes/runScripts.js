const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../scripts/generate_graphs.py');
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            console.error(stderr);
            return res.status(500).json({ error: 'Failed to run script' });
        }
        if (stderr) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ error: 'Script error' });
        }
        console.log(`Script output: ${stdout}`);
        return res.status(200).json({ message: 'Script executed successfully' });
    });
});

module.exports = router;










