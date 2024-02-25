/**
 * Player Model
 * Defines the structure for player documents within a basketball team context. Each player is characterized
 * by their name, position on the team, jersey number, and an optional image URL. The model also tracks the
 * seasons a player has participated in, using an array of references to Season documents. This allows for
 * comprehensive tracking of a player's career over time within the team, including their contributions in
 * various seasons.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    position: { type: String, required: true },
    jersey_number: { type: Number, required: true },
    seasons: [{ type: Schema.Types.ObjectId, ref: 'Season' }],
    image: { type: String } // Optional image URL
});

module.exports = mongoose.model('Player', playerSchema);
