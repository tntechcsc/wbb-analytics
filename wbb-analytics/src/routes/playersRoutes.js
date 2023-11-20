const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Adjust the path to your model

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;
