const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users'); // Adjust the path to your model

// GET all drills
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { username,password} = req.body;
  
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    password,
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Additional CRUD routes...

module.exports = router;