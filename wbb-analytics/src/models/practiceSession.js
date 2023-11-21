const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Date: String, // Assuming 'Date' is a string based on your JSON. Adjust if it's an actual Date.
    DrillIDs: mongoose.Schema.Types.ObjectId // Assuming this refers to a single drill ID.
});

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
