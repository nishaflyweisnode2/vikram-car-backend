const City = require('../model/cityModel');




// image upload function start 
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
// upload image Start
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images/cityImage",
        allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
    },
});
const upload = multer({ storage: storage });


const createCity = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        const { cityName } = req.body;
        const existingCity = await City.findOne({ cityName });
        if (existingCity) {
            return res.status(400).json({ status: 400, message: 'City already exists', city: existingCity });
        }
        const city = new City({
            cityName,
            image: req.file.path
        });
        await city.save();

        res.status(201).json({ status: 201, message: 'City created successfully', data: city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create city' });
    }
};


const getAllCity = async (req, res) => {
    try {
        const cities = await City.find();
        if (!cities || cities.length === 0) {
            return res.status(404).json({ status: 404, message: "No cities found" });
        }

        return res.status(200).json({ status: 200, data: cities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch cities' });
    }
};


module.exports = { createCity, getAllCity, upload };
