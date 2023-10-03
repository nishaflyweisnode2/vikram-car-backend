const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    },
    image: {
        type: String,
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
