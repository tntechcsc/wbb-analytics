const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Adjust the path to your model

// GET all players
router.get('/', async (req, res) => {
  console.log('fetching players...');
  try {
    const players = await Player.find();
    res.json(players);
    console.log(players);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;
