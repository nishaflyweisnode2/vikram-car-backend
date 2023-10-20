const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Closed'],
        default: 'Pending',
    },
    highestBid: {
        type: Number,
        default: 0,
    },
    bidIncrement: {
        type: Number,
        default: 0,
    },
    refereId: {
        type: String,
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    startingPrice: {
        type: Number,
        default: 0,
        min: 1,
    },
    finalPrice: {
        type: Number,
        default: 0,
    },
    approvalTime: {
        type: String,
    },
    vehicleAddress: {
        type: String,
    },
    missingDetails: {
        type: String,
    },
    note: {
        type: String,
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
        validate: {
            validator: function (endTime) {
                return endTime > this.startTime;
            },
            message: 'End time must be greater than start time',
        },
    },
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bid',
        },
    ],


}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
