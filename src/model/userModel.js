const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
    profileImage: [{ type: String }],
    selectedCity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
    },
    favouriteCars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
        }
    ],
    carRating: [
        {
            carId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Car',
            },
            rating: {
                type: Number,
                min: 0,
                max: 5,
            },
        },
    ],
    balance: {
        type: Number,
        default: 0,
    },
    myBids: [
        {
            auction: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Auction',
                required: true,
            },
            bidAmount: {
                type: Number,
                required: true,
            },
            car: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Car',
                required: true,
            },
            autobidEnabled: {
                type: Boolean,
                default: false,
            },
            autobidMaxBidAmount: {
                type: Number,
                default: 0,
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
        }
    ],
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
    },
    mySpareParts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SparePart',
    }],
    buyCar: [{ type: String }],



}, { timestamps: true })

const user = mongoose.model('User', userSchema);


module.exports = user;
