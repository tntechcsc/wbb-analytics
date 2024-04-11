const express = require('express');
const router = express.Router();
const Drill = require('../models/drill'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for drill validation
const drillSchema = Joi.object({
    practice_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    name: Joi.string().required(),
    tempo_events: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    shot_events: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    players_involved: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
});

// GET all drills
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find();
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const drill = await Drill.findById(req.params.id);
        if (!drill) {
            return res.status(404).json({ message: 'Drill not found' });
        }
        res.json(drill);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by name (case-insensitive search)
router.get('/name/:name', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find({ name: { $regex: new RegExp(req.params.name, 'i') } });
        if (!drills.length) {
            return res.status(404).json({ message: 'No drills found with that name' });
        }
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by practice ID
router.get('/practice/:practice_id', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find({ practice_id: req.params.practice_id });
        if (!drills.length) {
            return res.status(404).json({ message: 'No drills found for the given player' });
        }
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by tempo event ID
router.get('/tempo/:tempoId', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find({ tempo_events: req.params.tempoId });
        if (!drills.length) {
            return res.status(404).json({ message: 'No drills found for the given tempo event' });
        }
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by shot event ID
router.get('/shot/:shotId', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find({ shot_events: req.params.shotId });
        if (!drills.length) {
            return res.status(404).json({ message: 'No drills found for the given shot event' });
        }
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a drill by players involved
router.get('/players/:playerId', isAuthenticated, async (req, res) => {
    try {
        const drills = await Drill.find({ players_involved: req.params.playerId });
        if (!drills.length) {
            return res.status(404).json({ message: 'No drills found for the given player' });
        }
        res.json(drills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new drill with validation
router.post('/', isAuthenticated, async (req, res) => {
    const { error, value } = drillSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const drill = new Drill(value);

    try {
        await drill.save();
        res.status(201).json(drill);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create drill', error: err.message });
    }
});

// PATCH to update a drill by ID with validation
router.patch('/:id', isAuthenticated, async (req, res) => {
    const { error, value } = drillSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedDrill = await Drill.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!updatedDrill) {
            return res.status(404).json({ message: 'Drill not found' });
        }
        res.json(updatedDrill);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE a drill by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const drill = await Drill.findByIdAndDelete(req.params.id);
        if (!drill) {
            return res.status(404).json({ message: 'Drill not found' });
        }
        res.json({ message: 'Drill deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;
