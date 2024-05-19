const express = require('express');
const router = express.Router();
const Fighter = require('../models/Fighter');

// GET all fighters
router.get('/', async (req, res) => {
    try {
        const fighters = await Fighter.find();
        res.json({ fighters });
    } catch (err) {
        console.error('Error fetching fighters:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// POST a new fighter
router.post('/', async (req, res) => {
    const fighter = new Fighter(req.body);
    try {
        const newFighter = await fighter.save();
        res.status(201).json(newFighter);
    } catch (err) {
        console.error('Error adding fighter:', err);
        res.status(400).json({ message: 'Bad Request', error: err.message });
    }
});

module.exports = router;







