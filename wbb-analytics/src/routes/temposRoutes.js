const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tempo = require('../models/tempo'); // Adjust the path to your model

// GET all tempos
router.get('/', async (req, res) => {
  try {
    const tempos = await Tempo.find();
    res.json(tempos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to create a new tempo
router.post('/', async (req, res) => {
  // Assuming req.body includes all necessary fields: gameOrPractice_id, onModel, player_ids, tempo_type, transition_time
  const { gameOrPractice_id, onModel, player_ids, tempo_type, transition_time } = req.body;
  
  const newTempo = new Tempo({
    gameOrPractice_id, // References either a Game or Practice
    onModel, // 'Game' or 'Practice'
    player_ids, // Array of player ObjectIds involved in the tempo
    tempo_type, // 'offensive' or 'defensive'
    transition_time, // Time it took for the transition
    timestamp: new Date() // Current timestamp
  });

  try {
    await newTempo.save();
    res.status(201).json(newTempo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Additional CRUD routes...

module.exports = router;
