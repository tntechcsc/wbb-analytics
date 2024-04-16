const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Key = require('../models/key'); // Adjust the path as necessary


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

//Create a new key
router.post('/', async (req, res) => {
    const role = req.body.role;
    const key = generateRandomString(10);
    const newKey = new Key({
        _id: new mongoose.Types.ObjectId(),
        key,
        role
    }); 
    try {
        await newKey.save();
        res.status(201).json(newKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Delete a key when used, but only if it exists
router.delete('/:key', async (req, res) => {
    try {
        const key = await Key.findOneAndDelete({ key: req.params.key });
        if (!key) {
            return res.status(404).json({ message: 'Key not found' });
        }
        res.json(key);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;