const Offer = require('../model/offerModei');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');

const { createOfferSchema } = require('../validation/offerValidation');



const createOffer = async (req, res) => {
    try {
        const { error } = createOfferSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { user, car, amount, description } = req.body;

        const checkUser = await userDb.findById(user);
        if (!checkUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const checkCar = await Car.findById(car);
        if (!checkCar) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
        }
        const offer = new Offer({
            user,
            car,
            amount,
            description,
        });
        await offer.save();

        res.status(201).json({
            status: 201,
            message: 'Offer created successfully',
            offer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create offer' });
    }
};



const getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.status(200).json({ status: 200, offers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
};



module.exports = {
    createOffer,
    getAllOffers
};
