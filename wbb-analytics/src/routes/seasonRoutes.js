const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Season = require('../models/season'); // Adjust the path

// GET all seasons
router.get('/', async (req, res) => {
  try {
    const seasons = await Season.find();
    res.json(seasons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// post a season
router.post('/', async (req, res) => {
  const { year,players,games,practices } = req.body;
  const seasons = new Season({
    year,
    players,
    games,
    practices,
  });

  try {
    const newSeason = await seasons.save();
    res.status(201).json(newSeason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;