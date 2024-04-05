const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users'); // Adjust the path to your model
const bcrypt = require('bcryptjs');
const Joi = require('joi');
/*
// Authentication middleware
const isAuthenticated = (req, res, next) => {
  // Placeholder for your authentication logic
  next();
};

// Validation schema
const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
*/
// Generate a random string function


router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const {username,password,roles} = req.body;
  
  const existingUser = await User.findOne({ username });
  if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
  }
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    password,
    roles,
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// fetch user by username and password, give incorrect password error if searching fails
router.get('/userCheck/:username/:password', async (req, res) => {
  try {
    const username = req.params.username;
    const password = req.params.password; 
    const user = await User.findOne({ username: username});
    if (!user) {
      return res.status(404).json({ message: 'Incorrect username' })
    }
    // check if password is correct with bycrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(404).json({ message: 'Incorrect password' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional CRUD routes...

module.exports = router;