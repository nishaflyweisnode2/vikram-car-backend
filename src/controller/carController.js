const Car = require('../model/carModel');
const { carSchema, getCarsByBuyingOptionSchema } = require('../validation/carValidation');

const createCar = async (req, res) => {
    try {
        const { error } = carSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const {
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

        const car = new Car({
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

        return res.status(201).json({
            status: 201,
            message: 'Car created successfully',
            car,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create car' });
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




module.exports = { createCar, getCarsByBuyingOption };
