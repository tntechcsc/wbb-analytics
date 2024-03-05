const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const GameSession = require('../models/gameSession');
const PracticeSession = require('../models/practiceSession');
const Tempo = require('../models/tempo');
const Shot = require('../models/shot');

// Routes for Players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Game Sessions
router.get('/game-sessions', async (req, res) => {
  try {
    const gameSessions = await GameSession.find();
    res.json(gameSessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Practice Sessions
router.get('/practice-sessions', async (req, res) => {
  try {
    const practiceSessions = await PracticeSession.find();
    res.json(practiceSessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Tempos
router.get('/tempos', async (req, res) => {
  try {
    const tempos = await Tempo.find();
    res.json(tempos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Shots
router.get('/shots', async (req, res) => {
  try {
    const shots = await Shot.find();
    res.json(shots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
