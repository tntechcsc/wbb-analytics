const express = require('express');
const router = express.Router();
const PracticeSession = require('../models/practiceSession'); // Adjust the path

// GET all practice sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await PracticeSession.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET drills for a specific practice session
router.get('/:sessionId/drills', async (req, res) => {
  try {
    const session = await PracticeSession.findById(req.params.sessionId)
      .populate({
        path: 'DrillIDs',
        select: 'DrillName' // Only populate the DrillName field
      });
    const drillNames = session.DrillIDs.map(drill => ({ 
      id: drill._id,
      name: drill.DrillName 
    }));
    console.log(session.DrillIDs)
    res.json(drillNames); // Send an array of objects with id and DrillName
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const session = new PracticeSession({
    _id: new mongoose.Types.ObjectId(),
    Date: req.body.Date,
  });

  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Additional CRUD routes...

module.exports = router;
