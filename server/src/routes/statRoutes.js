const express = require('express');
const router = express.Router();
const Stat = require('../models/stat'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');


// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for game validation
const statSchema = Joi.object({
    gameOrDrill_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    player_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    type: Joi.string().required(),
    timestamp: Joi.date().required()
});


// GET all stats
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stat.find().populate('gameOrDrill_id player_id');
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Get stats by gameOrDrill_id
router.get('/byGameOrDrill/:gameOrDrillId', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stat.find({ gameOrDrill_id: mongoose.Types.ObjectId(req.params.gameOrDrillId) });
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Get stats by player_id
router.get('/byPlayer/:playerId', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stat.find({ player_id: mongoose.Types.ObjectId(req.params.playerId) });
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new stat
router.post('/', isAuthenticated, async (req, res) => {
    const { error } = statSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid request', error: error.details });
    }

    try {
        const stat = new Stat(req.body);
        const result = await stat.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PUT an existing stat
router.put('/:statId', isAuthenticated, async (req, res) => {
    const { error } = statSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid request', error: error.details });
    }

    try {
        const stat = await Stat.findByIdAndUpdate(req.params.statId, req.body, { new: true });
        res.json(stat);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;
