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
  const { DrillID, PlayersOnCourt, TimeToHalfCourt, PressDefenseTime } = req.body;
  
  const newTempo = new Tempo({
    _id: new mongoose.Types.ObjectId(),
    DrillID, 
    PlayersOnCourt, 
    TimeToHalfCourt, 
    PressDefenseTime
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
