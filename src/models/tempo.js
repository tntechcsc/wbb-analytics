/**
 * Tempo Model
 * Represents a tempo event within a basketball game or practice session. Each tempo event is associated
 * with a specific game, involves multiple players, and is characterized by its type (offensive or defensive),
 * the time it takes for the transition to occur, and the exact timestamp of the event. This model facilitates
 * tracking the speed and efficiency of team transitions during gameplay.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempoSchema = new Schema({
    gameOrPractice_id: { type: Schema.Types.ObjectId, required: false, refPath: 'onModel' },
    onModel: { type: String, required: true, enum: ['Game', 'Practice'] },
    player_ids: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
    tempo_type: { type: String, required: true, enum: ['offensive', 'defensive'] },
    transition_time: { type: Number, required: true },
    timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Tempo', tempoSchema);
