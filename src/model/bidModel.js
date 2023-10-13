const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
    },
    autobidEnabled: {
        type: Boolean,
        default: false,
    },
    autobidMaxBidAmount: {
        type: Number,
        default: 0,
    },
    bidAmount: {
        type: Number,
    },
    bidIncrement: {
        type: Number,
        default: 0,
    },
    lastBidAmount: {
        type: Number,
        default: 0,
    },
    autobidMaxBids: {
        type: Number,
        default: 0,
    },
    bidLimit: {
        type: Number,
        default: 0,
    },
    autoDecreaseEnabled: {
        type: Boolean,
        default: false,
    },
    decrementAmount: {
        type: Number,
        default: 0,
    },
    startBidAmount: {
        type: Number,
        default: 0,
    },
    currentBidAmount: {
        type: Number,
        default: 0,
    },
    bidStatus: {
        type: String,
        enum: ['Start Bidding', 'Winning', 'Losing'],
        default: 'Start Bidding',
    },
    bidTime: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
