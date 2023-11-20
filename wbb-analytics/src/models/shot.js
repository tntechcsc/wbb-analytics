const mongoose = require('mongoose');

const shotSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    DrillID: mongoose.Schema.Types.ObjectId,
    PlayerID: mongoose.Schema.Types.ObjectId,
    ShotZone: Number,
    MadeMissed: String,
    ShotClockThird: String
});

module.exports = mongoose.model('Shot', shotSchema);
