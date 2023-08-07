const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    status: {
        type: String,
        enum: ['subscribed', 'unsubscribed'],
        default: 'unsubscribed',
    },
    price: {
        type: Number,
        // required: true,
    },
    time: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
