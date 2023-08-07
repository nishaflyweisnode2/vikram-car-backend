const SpareDb = require('../model/spareModel');
const Brand = require('../model/brandModel');
const Car = require('../model/carModel');
const userDb = require('../model/userModel');


const { createSparePartSchema, getSpecificSparePartSchema, searchSparePartsSchema, buySparePartSchema } = require('../validation/spareValidation');




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





const createSparePart = async (req, res) => {
    try {
        const { error } = createSparePartSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const {
            name,
            brand,
            car,
            description,
            price,
            quantity,
            image,
        } = req.body;

        const checkBrand = await Brand.findById(brand);
        if (!checkBrand) {
            return res.status(404).json({ status: 404, message: 'No brand found for the given ID' });
        }
        const checkCar = await Car.findById(car);
        if (!checkCar) {
            return res.status(404).json({ status: 404, message: 'No car found for the given ID' });
        }
        const sparePart = new SpareDb({
            name,
            brand: checkBrand,
            car: checkCar,
            description,
            price,
            quantity,
            image,
        });

        await sparePart.save();
        const populatedSparePart = await SpareDb.findById(sparePart._id).populate('brand').populate('car').exec();

        res.status(201).json({
            status: 201,
            message: 'Spare part created successfully',
            sparePart: populatedSparePart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create spare part' });
    }
};


const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await SpareDb.find().populate('brand');

        res.status(200).json({ status: 200, spareParts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch spare parts' });
    }
};



const getSpecificSparePart = async (req, res) => {
    try {
        const { error } = getSpecificSparePartSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const sparePartId = req.params.sparePartId;
        const sparePart = await SpareDb.findById(sparePartId).populate('brand').populate('car').exec();

        if (!sparePart) {
            return res.status(404).json({ status: 404, message: 'Spare part not found' });
        }

        res.status(200).json({ status: 200, sparePart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch spare part' });
    }
};



const searchSpareParts = async (req, res) => {
    try {
        const { error } = searchSparePartsSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { searchQuery } = req.query;
        const query = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { 'brand.name': { $regex: searchQuery, $options: 'i' } },
                { 'car.name': { $regex: searchQuery, $options: 'i' } },
            ],
        };
        const spareParts = await SpareDb.find(query).populate('brand').populate('car');
        if (spareParts.length === 0) {
            const cars = await Car.find({ name: { $regex: searchQuery, $options: 'i' } }).populate('brand');
            if (cars.length === 0) {
                return res.status(404).json({ status: 404, message: 'No matching spare parts or cars found' });
            }
            return res.status(200).json({ status: 200, cars });
        }

        res.status(200).json({ status: 200, spareParts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search spare parts and cars' });
    }
};



const buySparePart = async (req, res) => {
    try {
        const { error } = buySparePartSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { sparePartId, userId } = req.body;

        const sparePart = await SpareDb.findById(sparePartId);
        if (!sparePart) {
            return res.status(404).json({ status: 404, message: 'Spare part not found' });
        }
        const checkUser = await userDb.findById(userId);
        if (!checkUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        if (sparePart.quantity <= 0) {
            return res.status(400).json({ status: 400, message: 'Spare part is out of stock' });
        }

        // payment or purchase logic here

        sparePart.quantity -= 1;
        await sparePart.save();

        checkUser.mySpareParts.push(sparePartId);
        await checkUser.save();

        const populatedUser = await userDb.findById(userId).populate('mySpareParts');

        res.status(200).json({ status: 200, message: 'Spare part purchased successfully', user: populatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to purchase spare part' });
    }
};



const updateSpareImage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading spare image' });
            }
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 400, message: 'No spare image uploaded' });
            }
            const imageUrl = req.files[0].path;
            const sparePartId = req.params.sparePartId;

            const spare = await SpareDb.findByIdAndUpdate(
                sparePartId,
                { $push: { image: imageUrl } },
                { new: true }
            );
            if (!spare) {
                return res.status(404).json({ status: 404, message: 'Spare not found' });
            }
            return res.status(200).json({
                status: 200,
                message: 'Spare image updated successfully',
                spare,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update spare image' });
    }
};

module.exports = updateSpareImage;






module.exports = {
    createSparePart,
    getAllSpareParts,
    getSpecificSparePart,
    searchSpareParts,
    buySparePart,
    updateSpareImage
};
