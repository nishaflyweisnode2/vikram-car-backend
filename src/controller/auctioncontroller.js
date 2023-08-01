const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const { createAuctionSchema } = require('../validation/auctionValidation');




const createAuction = async (req, res) => {
    try {
        const { error } = createAuctionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const {
            carId,
            startingPrice,
            status,
            highestBid,
            winner,
            approvalTime,
            vehicleAddress,
            missingDetails,
            note,
            startTime,
            endTime,
        } = req.body;

        const checkCarId = await Car.findById(carId);
        if (!checkCarId) {
            return res.status(404).json({ status: 404, message: 'Car with the given carId not found' });
        }
        const checkUserId = await userDb.findById(winner);
        if (!checkUserId) {
            return res.status(404).json({ status: 404, message: 'user with the given userId not found' });
        }

        const auction = new Auction({
            car: carId,
            startingPrice,
            status,
            highestBid,
            winner,
            approvalTime,
            vehicleAddress,
            missingDetails,
            note,
            startTime,
            endTime,
        });

        await auction.save();

        res.status(201).json({ status: 201, message: 'Auction created successfully', auction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create auction' });
    }
};






module.exports = {
    createAuction,
};
