const mongoose = require('mongoose');

const drillSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SessionID: mongoose.Schema.Types.ObjectId,
    StartTime: String,
    EndTime: String,
    ShotIDs: [mongoose.Schema.Types.ObjectId],
    TempoIDs: [mongoose.Schema.Types.ObjectId],
    DrillName: String
});

module.exports = mongoose.model('Drill', drillSchema);
