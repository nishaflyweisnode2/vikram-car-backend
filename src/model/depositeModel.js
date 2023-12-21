const mongoose = require('mongoose');


const securityDepositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    biddingLimit: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SecurityDeposit = mongoose.model('SecurityDeposit', securityDepositSchema);


module.exports = SecurityDeposit;
