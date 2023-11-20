const mongoose = require('mongoose');

const tempoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    DrillID: mongoose.Schema.Types.ObjectId,
    PlayersOnCourt: [mongoose.Schema.Types.ObjectId],
    TimeToHalfCourt: Number,
    PressDefenseTime: Number // Assuming this is a Number. Use 'mongoose.Schema.Types.Mixed' if the type varies.
});

module.exports = mongoose.model('Tempo', tempoSchema);
