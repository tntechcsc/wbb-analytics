const express = require('express');
const router = express.Router();
const Shot = require('../models/shots'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for shot validation
const shotSchema = Joi.object({
    gameOrPractice_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    onModel: Joi.string().required().valid('Game', 'Practice'),
    player_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    made: Joi.boolean().required(),
    zone: Joi.string().required(),
    shot_clock_time: Joi.string().required().valid('first_third', 'second_third', 'final_third'),
    timestamp: Joi.date().required()
});

// GET all shots with pagination, sorting, and optional filtering
router.get('/', isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-timestamp'; // Sort shots by timestamp by default

    // Optional filtering
    const filters = {};
    if(req.query.player_id) filters.player_id = mongoose.Types.ObjectId(req.query.player_id);
    if(req.query.made !== undefined) filters.made = req.query.made === 'true';
    if(req.query.zone) filters.zone = req.query.zone;
    if(req.query.shot_clock_time) filters.shot_clock_time = req.query.shot_clock_time;
    if(req.query.onModel) filters.onModel = req.query.onModel;
    if(req.query.gameOrPractice_id) filters.gameOrPractice_id = mongoose.Types.ObjectId(req.query.gameOrPractice_id);

    try {
        const shots = await Shot.find(filters)
                                .populate(['gameOrPractice_id', 'player_id'])
                                .skip(skip)
                                .limit(limit)
                                .sort(sort);
        const totalShots = await Shot.countDocuments(filters);
        res.json({
            total: totalShots,
            page,
            totalPages: Math.ceil(totalShots / limit),
            shots
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by 
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const shot = await Shot.findById(req.params.id).populate(['gameOrPractice_id', 'player_id']);
        if (!shot) {
            return res.status(404).json({ message: 'Shot not found' });
        }
        res.json(shot);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by gameOrPractice_id
router.get('/byGameOrPractice/:gameOrPracticeId', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ gameOrPractice_id: mongoose.Types.ObjectId(req.params.gameOrPracticeId) }).populate(['gameOrPractice_id', 'player_id']);
        if (!shots.length) {
            return res.status(404).json({ message: 'No shots found for the given gameOrPractice_id' });
        }
        res.json(shots);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a shot by player_id
router.get('/byPlayer/:playerId', isAuthenticated, async (req, res) => {
    try {
        const shots = await Shot.find({ player_id: mongoose.Types.ObjectId(req.params.playerId) }).populate(['gameOrPractice_id', 'player_id']);
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
        const shots = await Shot.find({ made: req.params.made === 'true' }).populate(['gameOrPractice_id', 'player_id']);
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
        const shots = await Shot.find({ zone: req.params.zone }).populate(['gameOrPractice_id', 'player_id']);
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
        const shots = await Shot.find({ shot_clock_time: req.params.shotClockTime }).populate(['gameOrPractice_id', 'player_id']);
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
        const shots = await Shot.find({ timestamp: req.params.timestamp }).populate(['gameOrPractice_id', 'player_id']);
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
        const updatedShot = await Shot.findByIdAndUpdate(req.params.id, value, { new: true }).populate(['gameOrPractice_id', 'player_id']);
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
