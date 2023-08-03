const mongoose = require('mongoose');

const transportServicesSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true,
    },
    fromLocation: {
        type: String,
        required: true,
    },
    toLocation: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    vehicleCondition: {
        type: String,
        required: true,
    },
    vehicleWheelCondition: {
        type: String,
        required: true,
    },
    additionalDetails: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


}, { timestamps: true });

const TransportServices = mongoose.model('TransportServices', transportServicesSchema);

module.exports = TransportServices;
