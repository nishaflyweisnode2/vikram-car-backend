const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    buyingOption: {
        type: String,
        enum: ["Live Auction", "Ready to Lift", "Used Vehicles", "Scrap-Spare"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        required: true,
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    isScrap: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    },
    transmission: {
        type: String,
    },
    engineSize: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    documentStatus: {
        type: String,
    },
    rto: {
        type: String
    },

});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
