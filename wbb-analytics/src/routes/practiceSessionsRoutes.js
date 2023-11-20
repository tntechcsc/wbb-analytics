const express = require('express');
const router = express.Router();
const PracticeSession = require('../models/practiceSession'); // Adjust the path

// GET all practice sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await PracticeSession.find().populate('drillID');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;
