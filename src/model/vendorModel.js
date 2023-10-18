const mongoose = require('mongoose');



const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        //required: true
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
        default: "Admin"
    },
    documents: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        alternateMobile: String,
        dateOfBirth: Date,
        addressLine1: String,
        addressLine2: String,
        panCardImage: [
            {
                type: String,
                required: true,
            },
        ],
        aadharCardImage: [
            {
                type: String,
                required: true,
            },
        ],
        selectYourDocument: String,
        otherDocumentImage: [
            {
                type: String,
                required: true,
            },
        ],
    },
    workProfile: {
        selectYourCity: String,
        chooseYourServices: [String],
        chooseYourSector: String,
        serviceableDistance: String,
    },


}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
