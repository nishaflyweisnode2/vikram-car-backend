const SpareDb = require('../model/spareModel');
const Brand = require('../model/brandModel');
const Car = require('../model/carModel');


const { createSparePartSchema } = require('../validation/spareValidation');



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
        let checkBrand = await Brand.findById(brand)
        if (!checkBrand) {
            return res.status(404).json({ status: 404, message: 'No cars Brand found for the given Id' });
        }
        let checkCar = await Car.findById(car)
        if (!checkCar) {
            return res.status(404).json({ status: 404, message: 'No cars found for the given Id' });
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
        const populatedCar = await SpareDb.findById(sparePart._id).populate('brand').exec();
        const populatedCar1 = await SpareDb.findById(checkCar._id).populate('car').exec();
        res.status(201).json({
            status: 201,
            message: 'Spare part created successfully',
            // sparePart,
            populatedCar,
            populatedCar1
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




module.exports = {
    createSparePart,
    getAllSpareParts,
};
