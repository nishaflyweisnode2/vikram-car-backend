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
    addToMyBids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auction',
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
            bidLimit: {
                type: Number,
            },
            startBidAmount: {
                type: Number,
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
            autoDecreaseEnabled: {
                type: Boolean,
                default: false,
            },
            decrementAmount: {
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
