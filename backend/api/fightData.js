const express = require('express');
const router = express.Router();
const FightData = require('../models/FightData');

// Get all fight data
router.get('/', async (req, res) => {
    try {
        const fightData = await FightData.find();
        res.json(fightData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get fight data by ID
router.get('/:id', getFightData, (req, res) => {
    res.json(res.fightData);
});

// Middleware to get fight data by ID
async function getFightData(req, res, next) {
    let fightData;
    try {
        fightData = await FightData.findById(req.params.id);
        if (fightData == null) {
            return res.status(404).json({ message: 'Cannot find fight data' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.fightData = fightData;
    next();
}

module.exports = router;

