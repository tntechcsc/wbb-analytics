const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statsSchema = new Schema({
    drill_id: { type: Schema.Types.ObjectId, ref: 'Drill', required: true },
    player_id: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    shots: [{ type: Schema.Types.ObjectId, ref: 'Shot', default: [] }],
    tempos: [{ type: Schema.Types.ObjectId, ref: 'Tempo', default: [] }],
    offensive_rebounds: { type: Number, required: true, default: 0 },
    defensive_rebounds: { type: Number, required: true, default: 0 },
    total_rebounds: { type: Number, required: true, default: 0 },
    assists: { type: Number, required: true, default: 0 },
    steals: { type: Number, required: true, default: 0 },
    blocks: { type: Number, required: true, default: 0 },
    turnovers: { type: Number, required: true, default: 0 },
    personal_fouls: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Stats', statsSchema);
