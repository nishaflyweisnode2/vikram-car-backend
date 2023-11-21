const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        name: {
            type: String,
            text: true,
        },
        image: {
            type: String,
        },
    },
    name: {
        type: String,
        text: true,
    },
    buyingOption: {
        type: String,
        enum: ["Live Auction", "Ready to Lift", "Used Vehicles", "Scrap-Spare"],
    },
    price: {
        type: Number,
    },
    model: {
        type: String,
    },
    variant: {
        type: String,
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
        text: true,

    },
    description: {
        type: String,
    },
    image: [
        {
            type: String,
        },
    ],
    imageLinks: [
        {
            type: String,
        },
    ],
    year: {
        type: Number,
    },
    totalKm: {
        type: Number,
        default: 0
    },
    sellCarImage: [
        {
            type: String,
        },
    ],
    mileage: {
        type: Number,
    },
    owner: {
        type: String,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    isScrap: {
        type: Boolean,
        default: false,
    },
    isSellCar: {
        type: Boolean,
        default: false,
    },
    isSold: {
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


}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
