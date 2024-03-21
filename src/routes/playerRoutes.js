const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Ensure this path matches your project structure
const Joi = require('joi');

// Define Joi schema for player validation
const playerSchema = Joi.object({
    name: Joi.string().required(),
    jersey_number: Joi.number().integer().min(0).required(),
    seasons: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional() // Validates MongoDB ObjectIds
});

// Authentication middleware - to be replaced with actual logic
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// GET all players with pagination and optional sorting
router.get('/', isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'name'; // Sort players by name by default

    try {
        const players = await Player.find().sort(sort).skip(skip).limit(limit).populate('seasons');
        const totalPlayers = await Player.countDocuments();

        res.json({
            total: totalPlayers,
            page,
            totalPages: Math.ceil(totalPlayers / limit),
            players
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


// GET a player by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('seasons');
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET players by name (case-insensitive search)
router.get('/name/:name', isAuthenticated, async (req, res) => {
    try {
        const players = await Player.find({ name: { $regex: new RegExp(req.params.name, 'i') } }).populate('seasons');
        if (!players.length) {
            return res.status(404).json({ message: 'No players found with that name' });
        }
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET players by jersey number
router.get('/jersey/:jerseyNumber', isAuthenticated, async (req, res) => {
    try {
        const players = await Player.find({ jersey_number: req.params.jerseyNumber }).populate('seasons');
        if (!players.length) {
            return res.status(404).json({ message: 'No players found with that jersey number' });
        }
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new player with validation
router.post('/', isAuthenticated, async (req, res) => {
    const { error, value } = playerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const player = new Player(value);

    try {
        await player.save();
        res.status(201).json(player);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create player', error: err.message });
    }
});

// PATCH to update a player with validation
router.patch('/:id', isAuthenticated, async (req, res) => {
    const { error, value } = playerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, value, { new: true }).populate('seasons');
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(updatedPlayer);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE a player
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;
