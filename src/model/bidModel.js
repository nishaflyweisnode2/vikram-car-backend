const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
    },
    bidStatus: {
        type: String,
        enum: ['StartBidding', 'Winning', 'Losing'],
        default: 'StartBidding',
    },
    bidTime: {
        type: Date,
        default: Date.now,
    },
    winStatus: {
        type: String,
        enum: ['Underprocess', 'Backout', 'Uplifted', 'Approve', 'Reject'],
        default: 'Underprocess',
    },
    isAutobid: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
