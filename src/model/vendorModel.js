const mongoose = require('mongoose');



const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    mobileNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        //required: true
    },
    otp: {
        type: String,
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
        },
        email: {
            type: String,
            lowercase: true,
        },
        phone: {
            type: String,
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
            },
        ],
        aadharCardImage: [
            {
                type: String,
            },
        ],
        selectYourDocument: String,
        otherDocumentImage: [
            {
                type: String,
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
