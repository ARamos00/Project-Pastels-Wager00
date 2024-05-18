// backend/routes/fighter.js
const express = require('express');
const router = express.Router();
const Fighter = require('../models/Fighter');

// GET all fighters
router.get('/', async (req, res) => {
    try {
        const fighters = await Fighter.find();
        res.json({ fighters });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new fighter
router.post('/', async (req, res) => {
    const fighter = new Fighter(req.body);
    try {
        const newFighter = await fighter.save();
        res.status(201).json(newFighter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

