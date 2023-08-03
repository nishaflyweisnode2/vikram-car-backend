const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
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
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    startingPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    finalPrice: {
        type: Number,
    },
    approvalTime: {
        type: Date,
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
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (endTime) {
                return endTime > this.startTime;
            },
            message: 'End time must be greater than start time',
        },
    },


}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
