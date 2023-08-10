const mongoose = require('mongoose');


const securityDepositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    biddingLimit: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SecurityDeposit = mongoose.model('SecurityDeposit', securityDepositSchema);


module.exports = SecurityDeposit;
