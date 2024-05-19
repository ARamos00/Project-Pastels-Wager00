const express = require('express');
const router = express.Router();
const createFighterModel = require('../models/Fighter');
const Fighter = createFighterModel();
const debug = require('debug')('server:fighters');

// GET all fighters
router.get('/', async (req, res) => {
    debug('Received request to fetch all fighters');
    try {
        const fighters = await Fighter.find();
        debug(`Fetched ${fighters.length} fighters`);
        res.json({ fighters });
    } catch (err) {
        debug('Error fetching fighters:', err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// GET a single fighter by ID
router.get('/:id', async (req, res) => {
    debug(`Received request to fetch fighter with id ${req.params.id}`);
    try {
        const fighter = await Fighter.findById(req.params.id);
        if (!fighter) {
            debug(`Fighter with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'Fighter.js not found' });
        }
        debug(`Fetched fighter with id ${req.params.id}`);
        res.json(fighter);
    } catch (err) {
        debug('Error fetching fighter:', err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// POST a new fighter
router.post('/', async (req, res) => {
    debug('Received request to add a new fighter');
    const fighter = new Fighter(req.body);
    try {
        const newFighter = await fighter.save();
        debug(`Added new fighter with id ${newFighter._id}`);
        res.status(201).json(newFighter);
    } catch (err) {
        debug('Error adding fighter:', err.message);
        res.status(400).json({ message: 'Bad Request', error: err.message });
    }
});

// PUT to update a fighter by ID
router.put('/:id', async (req, res) => {
    debug(`Received request to update fighter with id ${req.params.id}`);
    try {
        const updatedFighter = await Fighter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFighter) {
            debug(`Fighter with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'Fighter.js not found' });
        }
        debug(`Updated fighter with id ${req.params.id}`);
        res.json(updatedFighter);
    } catch (err) {
        debug('Error updating fighter:', err.message);
        res.status(400).json({ message: 'Bad Request', error: err.message });
    }
});

// DELETE a fighter by ID
router.delete('/:id', async (req, res) => {
    debug(`Received request to delete fighter with id ${req.params.id}`);
    try {
        const deletedFighter = await Fighter.findByIdAndDelete(req.params.id);
        if (!deletedFighter) {
            debug(`Fighter with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'Fighter.js not found' });
        }
        debug(`Deleted fighter with id ${req.params.id}`);
        res.json({ message: 'Fighter.js deleted successfully' });
    } catch (err) {
        debug('Error deleting fighter:', err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;







