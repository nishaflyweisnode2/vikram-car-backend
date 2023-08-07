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
    profileImage: {
        type: String,
        // required: true
    },
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
                type: String,
            }
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



}, { timestamps: true })

const user = mongoose.model('User', userSchema);


module.exports = user;
