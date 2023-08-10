const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            //required: true,
            ref: 'Brand'
        },
        name: {
            type: String,
            text: true,
            //required: true,
        },
        image: {
            type: String,
            //required: true,
        },
    },
    name: {
        type: String,
        required: true,
        text: true,
    },
    buyingOption: {
        type: String,
        enum: ["Live Auction", "Ready to Lift", "Used Vehicles", "Scrap-Spare"],
        //required: true,
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
        text: true,

    },
    description: {
        type: String,
        required: true,
    },
    image: [
        {
            type: String,
            required: true,
        },
    ],
    year: {
        type: Number,
        required: true,
    },
    totalKm: {
        type: Number,
        default: 0
        //required: true,
    },
    sellCarImage: [
        {
            type: String,
            required: true,
        },
    ],
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
