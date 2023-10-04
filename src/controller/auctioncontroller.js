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


const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.status(200).json({ status: 200, auctions }).populate('car winner');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch auctions' });
    }
};


const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.auctionId).populate('car winner');

        if (!auction) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }

        res.status(200).json({ status: 200, auction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the auction' });
    }
};


const getAuctionsByCarId = async (req, res) => {
    try {
        const { carId } = req.params;

        const auctions = await Auction.find({ car: carId });

        if (!auctions || auctions.length === 0) {
            return res.status(404).json({ status: 404, message: 'No auctions found for the given carId' });
        }

        res.status(200).json({ status: 200, data: auctions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch auctions by carId' });
    }
};






module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    getAuctionsByCarId
};
