/**
 * Drill Model
 * Defines the schema for a basketball drill conducted during practice sessions. Each drill is linked to a
 * specific practice session and includes a name. The model also tracks tempo and shot events associated
 * with the drill, allowing for detailed analysis of player performance and team dynamics during practice.
 * The drill schema includes references to related tempo and shot event documents to facilitate this analysis.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drillSchema = new Schema({
    practice_id: { type: Schema.Types.ObjectId, ref: 'Practice', required: true },
    name: { type: String, required: true },
    tempo_events: [{ type: Schema.Types.ObjectId, ref: 'TempoEvent', default: [] }],
    shot_events: [{ type: Schema.Types.ObjectId, ref: 'ShotEvent', default: [] }]
});

module.exports = mongoose.model('Drill', drillSchema);
