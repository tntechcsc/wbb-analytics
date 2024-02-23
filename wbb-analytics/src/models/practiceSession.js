/**
 * Practice Model
 * Represents a practice session for a basketball team, linked to a specific season. Each practice session is
 * identified by its date and can include multiple drills aimed at improving team skills and player performance.
 * The model captures these drills through references to the Drill documents, enabling detailed tracking of
 * practice activities and their outcomes. This structured approach allows coaches to analyze the effectiveness
 * of practice sessions over the course of a season.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const practiceSessionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Assuming this refers to a single player ID.
    Date: String, // Assuming 'Date' is a string based on your JSON. Adjust if it's an actual Date.
    DrillIDs: mongoose.Schema.Types.ObjectId // Assuming this refers to a single drill ID.
});

const practiceSchema = new Schema({
    season_id: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    date: { type: Date, required: true },
    drills: [{ type: Schema.Types.ObjectId, ref: 'Drill', default: [] }]
});

module.exports = mongoose.model('Practice', practiceSchema);
