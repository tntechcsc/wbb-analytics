const express = require('express');
const router = express.Router();
const Tempo = require('../models/tempos'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for tempo validation
const tempoSchema = Joi.object({
    gameOrPractice_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    onModel: Joi.string().required().valid('Game', 'Practice'),
    player_ids: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(),
    tempo_type: Joi.string().required().valid('offensive', 'defensive'),
    transition_time: Joi.number().required(),
    timestamp: Joi.date().required()
});

// GET all tempo events with pagination, sorting, and optional filtering
router.get('/', isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-timestamp'; // Sort tempo events by timestamp by default

    // Optional filtering
    const filters = {};
    if(req.query.onModel) filters.onModel = req.query.onModel;
    if(req.query.tempo_type) filters.tempo_type = req.query.tempo_type;
    if(req.query.gameOrPractice_id) filters.gameOrPractice_id = mongoose.Types.ObjectId(req.query.gameOrPractice_id);

    try {
        const tempos = await Tempo.find(filters)
                                  .populate(['gameOrPractice_id', 'player_ids'])
                                  .skip(skip)
                                  .limit(limit)
                                  .sort(sort);
        const totalTempos = await Tempo.countDocuments(filters);
        res.json({
            total: totalTempos,
            page,
            totalPages: Math.ceil(totalTempos / limit),
            tempos
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a tempo event by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const tempo = await Tempo.findById(req.params.id).populate(['gameOrPractice_id', 'player_ids']);
        if (!tempo) {
            return res.status(404).json({ message: 'Tempo event not found' });
        }
        res.json(tempo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempo events by gameOrPractice_id
router.get('/byGameOrPractice/:gameOrPracticeId', isAuthenticated, async (req, res) => {
    try {
        const tempos = await Tempo.find({ gameOrPractice_id: mongoose.Types.ObjectId(req.params.gameOrPracticeId) })
                                  .populate(['gameOrPractice_id', 'player_ids']);
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempo events by player_id
router.get('/byPlayer/:playerId', isAuthenticated, async (req, res) => {
    try {
        const tempos = await Tempo.find({ player_ids: mongoose.Types.ObjectId(req.params.playerId) })
                                  .populate(['gameOrPractice_id', 'player_ids']);
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempo events by tempo_type
router.get('/byTempoType/:tempoType', isAuthenticated, async (req, res) => {
    try {
        const tempos = await Tempo.find({ tempo_type: req.params.tempoType })
                                  .populate(['gameOrPractice_id', 'player_ids']);
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET tempo events by timestamp
router.get('/byTimestamp/:timestamp', isAuthenticated, async (req, res) => {
    try {
        const tempos = await Tempo.find({ timestamp: req.params.timestamp })
                                  .populate(['gameOrPractice_id', 'player_ids']);
        res.json(tempos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new tempo event with validation
router.post('/', isAuthenticated, async (req, res) => {
    const { error, value } = tempoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const tempo = new Tempo(value);

    try {
        await tempo.save();
        res.status(201).json(tempo);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create tempo event', error: err.message });
    }
});

// PATCH to update a tempo event by ID with validation
router.patch('/:id', isAuthenticated, async (req, res) => {
    const { error, value } = tempoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedTempo = await Tempo.findByIdAndUpdate(req.params.id, value, { new: true })
                                        .populate(['gameOrPractice_id', 'player_ids']);
        if (!updatedTempo) {
            return res.status(404).json({ message: 'Tempo event not found' });
        }
        res.json(updatedTempo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE a tempo event by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const tempo = await Tempo.findByIdAndDelete(req.params.id);
        if (!tempo) {
            return res.status(404).json({ message: 'Tempo event not found' });
        }
        res.json({ message: 'Tempo event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete tempo event', error: err.message });
    }
});

module.exports = router;
