const mongoose = require('mongoose');

const myBidsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
    },
    bidLimit: {
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
    winBidAmount: {
        type: Number,
        default: 0,
    },
    autobidEnabled: {
        type: Boolean,
        default: true,
    },
    autobidMaxBidAmount: {
        type: Number,
        default: 0,
    },
    bidIncrementAmount: {
        type: Number,
        default: 0,
    },
    lastBidAmount: {
        type: Number,
        default: 0,
    },
    autoDecreaseEnabled: {
        type: Boolean,
        default: true,
    },
    bidDecrementAmount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const MyBids = mongoose.model('MyBids', myBidsSchema);

module.exports = MyBids;
