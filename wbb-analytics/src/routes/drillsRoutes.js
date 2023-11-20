const express = require('express');
const router = express.Router();
const Drill = require('../models/drill'); // Adjust the path to your model

// GET all drills
router.get('/', async (req, res) => {
  try {
    const drills = await Drill.find();
    res.json(drills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;
