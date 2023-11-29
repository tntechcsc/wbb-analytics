const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Date: String,
    DrillIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drill' }] // Array of ObjectIds
});

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
