const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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



router.post('/', async (req, res) => {
  const { SessionID, StartTime, EndTime, ShotIDs, TempoIDs, DrillName } = req.body;
  
  const newDrill = new Drill({
    _id: new mongoose.Types.ObjectId(),
    SessionID,
    StartTime,
    EndTime,
    ShotIDs,
    TempoIDs,
    DrillName
  });

  try {
    await newDrill.save();
    res.status(201).json(newDrill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Additional CRUD routes...

module.exports = router;
