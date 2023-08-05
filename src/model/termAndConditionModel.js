const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TermsAndConditions = mongoose.model('TermsAndConditions', termsAndConditionsSchema);

module.exports = TermsAndConditions;
