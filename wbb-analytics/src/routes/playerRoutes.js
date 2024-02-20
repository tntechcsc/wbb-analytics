const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Joi = require('joi'); // Ensure Joi is required

// GET all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a player by ID
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET a player by name
router.get('/name/:name', async (req, res) => {
    try {
        const player = await Player.findOne({ name: { $regex: new RegExp(req.params.name, "i") } });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET players by jersey number
router.get('/jersey/:jerseyNumber', async (req, res) => {
  try {
      const players = await Player.find({ jersey_number: req.params.jerseyNumber });
      if (players.length === 0) {
          return res.status(404).json({ message: 'No players found with this jersey number' });
      }
      res.json(players);
  } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// GET players by position
router.get('/position/:position', async (req, res) => {
    try {
        const players = await Player.find({ position: req.params.position });
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// POST a new player
router.post('/', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        position: Joi.string().required(),
        jersey_number: Joi.number().required(), // Adjusted to match schema
        image: Joi.string().uri().optional() // Made optional and URI validation added
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const player = new Player({
        name: req.body.name,
        position: req.body.position,
        jersey_number: req.body.jersey_number, // Adjusted to match schema
        image: req.body.image
    });

    try {
        await player.save();
        res.status(201).json(player);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create player', error: err.message });
    }
});

// PATCH to update a player
router.patch('/:id', async (req, res) => {
    try {
        const update = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!update) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(update);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// DELETE a player
router.delete('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Deleted player' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;
