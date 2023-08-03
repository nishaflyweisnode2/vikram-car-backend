const mongoose = require('mongoose');

const rtoSchema = new mongoose.Schema({
    iWant: {
        type: String,
        required: true,
    },
    fromState: {
        type: String,
        required: true,
    },
    toState: {
        type: String,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    ownedBy: {
        type: String,
        required: true,
    },
    vehicleClass: {
        type: String,
        required: true,
    },
    additionalQuestions: {
        type: String,
    },


}, { timestamps: true });


const RTO = mongoose.model('RTO', rtoSchema);

module.exports = RTO;
