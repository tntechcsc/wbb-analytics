const express = require('express');
const router = express.Router();
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

// Additional CRUD routes...

module.exports = router;
