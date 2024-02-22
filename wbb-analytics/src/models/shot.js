/**
 * Shot Model
 * This schema represents each shot attempt within a game, linking to both the game and the player who took the shot. 
 * It records whether the shot was made or missed, the court zone from which the shot was taken, the time left on the 
 * shot clock, and the exact timestamp of the attempt. This detailed tracking enables analysis of shooting performance 
 * and decision-making under various game conditions.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shotSchema = new Schema({
    gameOrPractice_id: { type: Schema.Types.ObjectId, required: true, refPath: 'onModel' },
    onModel: { type: String, required: true, enum: ['Game', 'Practice'] },
    player_id: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    made: { type: Boolean, required: true },
    zone: { type: String, required: true },
    shot_clock_time: { type: String, required: true, enum: ['first_third', 'second_third', 'final_third'] },
    timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Shot', shotSchema);
