const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    carDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    },
    quoteAmount: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
