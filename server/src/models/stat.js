const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statSchema = new Schema({
    gameOrDrill_id: { type: Schema.Types.ObjectId, required: true },
    player_id: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Stat', statSchema);