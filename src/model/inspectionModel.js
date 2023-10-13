const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    inspectionDate: {
        type: Date,
        required: true,
    },
    inspectionType: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

const Inspection = mongoose.model('Inspection', inspectionSchema);

module.exports = Inspection;
