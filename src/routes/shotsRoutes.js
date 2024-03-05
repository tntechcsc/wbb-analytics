const express = require('express');
const router = express.Router();
const Shot = require('../models/shot'); // Adjust the path to your model

// GET all shots
router.get('/', async (req, res) => {
  try {
    const shots = await Shot.find();
    res.json(shots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;
