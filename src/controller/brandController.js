const Brand = require('../model/brandModel');
const { createBrandSchema } = require('../validation/brandValidation');



// video upload function start 
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
        folder: "images/image",
        allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
    },
});
const upload = multer({ storage: storage })
// upload image End



const createBrand = async (req, res) => {
    try {
        const { error } = createBrandSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { name } = req.body;
        let image = "";

        if (req.file) {
            image = req.file.path;
        }
        const brand = new Brand({
            name,
            image
        });
        await brand.save();

        res.status(201).json({ status: 201, message: 'Brand created successfully', brand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};



const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();

        res.status(200).json({ status: 200, message: 'All brands retrieved successfully', brands });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};








module.exports = {
    createBrand,
    upload,
    getAllBrands
};
