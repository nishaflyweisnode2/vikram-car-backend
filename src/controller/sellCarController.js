const sellCarDb = require('../model/carModel')
const Brand = require('../model/brandModel');

const { sellCarSchema } = require('../validation/sellCarValidation');




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
        folder: "images/image",
        allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
    },
});
const upload = multer({ storage: storage }).array('sellCarImage');
// upload image End




const sellCar = async (req, res) => {
    try {
        const { error } = sellCarSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const {
            brand,
            name,
            price,
            model,
            variant,
            fuelType,
            description,
            image,
            year,
            mileage,
            owner,
            color,
            transmission,
            engineSize,
            state,
            city,
            rto,
            documentStatus,
            totalKm,
        } = req.body;
        let checkBrand = await Brand.findById(brand)
        if (!checkBrand) {
            return res.status(404).json({ status: 404, message: 'No cars Brand found for the given Id' });
        }
        const car = new sellCarDb({
            brand: checkBrand,
            name,
            price,
            model,
            variant,
            fuelType,
            description,
            image,
            year,
            mileage,
            owner,
            isUsed: true,
            color,
            transmission,
            engineSize,
            state,
            city,
            rto,
            documentStatus,
            totalKm
        });
        await car.save();
        const populatedCar = await sellCarDb.findById(car._id).populate('brand').exec();

        res.status(201).json({
            status: 201,
            message: 'Car sold successfully',
            populatedCar,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to sell car' });
    }
};



const updateSellCarImage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading car image', err });
            }
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 400, message: 'No car image uploaded' });
            }
            const imageUrl = req.files[0].path;
            const carId = req.params.carId;
            const car = await sellCarDb.findByIdAndUpdate(carId, { $push: { sellCarImage: imageUrl } },
                { new: true }
            );
            if (!car) {
                return res.status(404).json({ status: 404, message: 'Car not found' });
            }
            return res.status(200).json({
                status: 200,
                message: 'sellCar image updated successfully',
                car,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update car image' });
    }
};




module.exports = { sellCar, updateSellCarImage };
