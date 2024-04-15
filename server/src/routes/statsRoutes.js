const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Joi = require('joi');
const Stats = require('../models/stats'); // Adjust the path as necessary

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // Placeholder for your authentication logic
    next();
};

// Define Joi schema for stats validation
const statsSchema = Joi.object({
    drill_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    player_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    offensive_rebounds: Joi.number().required(),
    defensive_rebounds: Joi.number().required(),
    assists: Joi.number().required(),
    steals: Joi.number().required(),
    blocks: Joi.number().required(),
    turnovers: Joi.number().required(),
});

// GET all stats without pagination
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.find();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET stats by player_id
router.get('/byPlayer/:playerId', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.find({ player_id: req.params.playerId });
        if (!stats.length) {
            return res.status(404).json({ message: 'No stats found for the given player_id' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET stats by drill_id
router.get('/byDrill/:drillId', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.find({ drill_id: req.params.drillId });
        if (!stats.length) {
            return res.status(404).json({ message: 'No stats found for the given drill_id' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST new stats with validation
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const stats = req.body;
        const { error } = statsSchema.validate(stats);
        if (error) {
            return res.status(400).json({ message: 'Invalid request', error: error.details });
        }
        const newStats = await Stats.create(stats);
        res.status(201).json(newStats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PATCH to update stats by ID with validation
router.patch('/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = req.body;
        const { error } = statsSchema.validate(stats);
        if (error) {
            return res.status(400).json({ message: 'Invalid request', error: error.details });
        }
        const updatedStats = await Stats.findByIdAndUpdate(req.params.id, stats, { new: true });
        if (!updatedStats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(updatedStats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PATCH to update offensive rebounds by one
router.patch('/offensiveRebound/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { offensive_rebounds: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PATCH to update defensive rebounds by one
router.patch('/defensiveRebound/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { defensive_rebounds: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
 
// PATCH to update assists by one
router.patch('/assist/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { assists: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
 
// PATCH to update steals by one
router.patch('/steal/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { steals: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});
 
// PATCH to update blocks by one
router.patch('/block/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { blocks: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PATCH to update blocks by one
router.patch('/turnover/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndUpdate(req.params.id, { $inc: { turnovers: 1 } }, { new: true });
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// PATCH to update stats by player_id and drill_id
router.patch('/byPlayerAndDrill/:playerId/:drillId', isAuthenticated, async (req, res) => {
    try {
        const stats = req.body;
        const { error } = statsSchema.validate(stats);
        if (error) {
            return res.status(400).json({ message: 'Invalid request', error: error.details });
        }
        const updatedStats = await Stats.findOneAndUpdate({ player_id: req.params.playerId, drill_id: req.params.drillId }, stats, { new: true });
        if (!updatedStats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(updatedStats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE stats by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const stats = await Stats.findByIdAndDelete(req.params.id);
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;