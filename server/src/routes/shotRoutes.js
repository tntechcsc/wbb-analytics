const express = require('express');
const router = express.Router();
const Shot = require('../models/shot'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for shot validation
const shotSchema = Joi.object({
    gameOrDrill_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    onModel: Joi.string().required().valid('Game', 'Practice'),
    player_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    made: Joi.boolean().required(),
    zone: Joi.string().required(),
    shot_clock_time: Joi.string().required().valid('first_third', 'second_third', 'final_third'),
    timestamp: Joi.date().required()
});

// GET all shots without pagination
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find();
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by 
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const shot = await Shot.findById(req.params.id);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        res.json(shot);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by gameOrDrill_id
router.get('/byGameOrDrill/:gameOrDrillId', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ gameOrDrill_id: req.params.gameOrDrillId });
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given gameOrDrillId' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by player_id
router.get('/byPlayer/:playerId', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ player_ids: req.params.playerId }); //Shot model has "player_ids" as an attribute, plural
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given player_id' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by made
router.get('/byMade/:made', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ made: req.params.made === 'true' });
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given made value' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by zone
router.get('/byZone/:zone', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ zone: req.params.zone });
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given zone' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by shot_clock_time
router.get('/byShotClockTime/:shotClockTime', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ shot_clock_time: req.params.shotClockTime });
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given shot clock time' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by timestamp
router.get('/byTimestamp/:timestamp', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ timestamp: req.params.timestamp });
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given timestamp' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new shot with validation
router.post('/', isAuthenticated, async (req, res) => {
    const { error, value } = shotSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const shot = new Shot(value);

    try {
        await shot.save();
        res.status(201).json(shot);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create shot', error: err.message });
    }
});

// PATCH to update a shot by ID with validation
router.patch('/:id', isAuthenticated, async (req, res) => {
    const { error, value } = shotSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedShot = await Shot.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!updatedShot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        res.json(updatedShot);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE a shot by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const shot = await Shot.findByIdAndDelete(req.params.id);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        res.json({ message: 'Shot deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete shot', error: err.message });
    }
});

module.exports = router;
