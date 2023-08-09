const Car = require('../model/carModel');
const Brand = require('../model/brandModel');
const mongoose = require('mongoose');
const { carSchema, getCarsByBuyingOptionSchema, searchCarsSchema, compareCarsSchema } = require('../validation/carValidation');



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
const upload = multer({ storage: storage }).array('image');
// upload image End




const createCar = async (req, res) => {
    try {
        const { error } = carSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const {
            brand,
            name,
            buyingOption,
            price,
            model,
            variant,
            fuelType,
            description,
            image,
            year,
            mileage,
            owner,
            isUsed,
            isScrap,
            color,
            transmission,
            engineSize,
            state,
            city,
            rto,
            documentStatus
        } = req.body;
        let checkBrand = await Brand.findById(brand)
        if (!checkBrand) {
            return res.status(404).json({ status: 404, message: 'No cars Brand found for the given Id' });
        }
        const car = new Car({
            brand: checkBrand,
            name,
            buyingOption,
            price,
            model,
            variant,
            fuelType,
            description,
            image,
            year,
            mileage,
            owner,
            isUsed,
            isScrap,
            color,
            transmission,
            engineSize,
            state,
            city,
            rto,
            documentStatus
        });

        await car.save();
        const populatedCar = await Car.findById(car._id).populate('brand').exec();


        return res.status(201).json({
            status: 201,
            message: 'Car created successfully',
            // car,
            populatedCar
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create car' });
    }
};



const updateCarImage = async (req, res) => {
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
            const car = await Car.findByIdAndUpdate(carId, { $push: { image: imageUrl } },
                { new: true }
            );
            if (!car) {
                return res.status(404).json({ status: 404, message: 'Car not found' });
            }
            return res.status(200).json({
                status: 200,
                message: 'Car image updated successfully',
                car,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update car image' });
    }
};



const getCarsByBuyingOption = async (req, res) => {
    try {
        const { error } = getCarsByBuyingOptionSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const buyingOption = req.params.buyingOption;
        const cars = await Car.find({ buyingOption });
        if (!cars || cars.length === 0) {
            return res.status(404).json({ status: 404, message: 'No cars found for the given buying option' });
        }

        res.status(200).json({ status: 200, data: cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};




const searchCars = async (req, res) => {
    try {
        const { error } = searchCarsSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { brand, rto, filter } = req.query;
        let query = {};

        if (brand && rto) {
            const foundBrand = await Car.findOne({ "brand.name": brand });
            if (!foundBrand) {
                return res.status(404).json({ status: 404, message: 'Brand not found' });
            }
            query.$and = [{ brand: foundBrand.brand }, { rto }];
        } else if (brand) {
            const foundBrand = await Car.findOne({ "brand.name": brand });
            if (!foundBrand) {
                return res.status(404).json({ status: 404, message: 'Brand not found' });
            }
            query.brand = foundBrand.brand;
        } else if (rto) {
            query.rto = rto;
        }

        if (filter) {
            if (filter === 'mileage') {
                query.mileage = { $lt: 25 };
            } else if (filter === 'price') {
                query.price = { $gte: 100000, $lte: 2000000000 };
            } else if (filter === 'totalKm') {
                query.totalKm = { $gte: 50000, $lte: 200000 };
            } else if (filter === 'year') {
                query.year = { $gte: 2019, $lte: 2024 };
            }
        }
        const cars = await Car.find(query).populate('brand');

        res.status(200).json({ status: 200, cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search cars' });
    }
};



const compareCars = async (req, res) => {
    try {
        const { error } = compareCarsSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { car1Id, car2Id } = req.query;

        const car1 = await Car.findById(car1Id);
        const car2 = await Car.findById(car2Id);

        if (!car1 || !car2) {
            return res.status(404).json({ status: 404, message: 'Cars not found' });
        }
        const comparisonResult = {
            car1: car1.toObject(),
            car2: car2.toObject(),
        };

        res.status(200).json({ status: 200, comparisonResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to compare cars' });
    }
};





module.exports = { createCar, updateCarImage, getCarsByBuyingOption, searchCars, compareCars };