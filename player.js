const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    position: String,
    jersey_number: Number,
    height: String,
    year: String,
    image: String
});

module.exports = mongoose.model('Player', playerSchema);