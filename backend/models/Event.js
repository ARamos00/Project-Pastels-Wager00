const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event_name: String,
    date: Date,
    location: String,
    main_card: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FightData' }],
    prelims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FightData' }],
    early_prelims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FightData' }]
});

module.exports = mongoose.model('Event', eventSchema);
