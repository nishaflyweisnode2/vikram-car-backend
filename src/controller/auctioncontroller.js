const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const { createAuctionSchema, auctionUpdateSchema } = require('../validation/auctionValidation');




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
            bidIncrement,
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
        if (winner) {
            const checkUserId = await userDb.findById(winner);
            if (!checkUserId) {
                return res.status(404).json({ status: 404, message: 'user with the given userId not found' });
            }
        }
        const referId = Math.floor(10000 + Math.random() * 90000);

        const auction = new Auction({
            car: carId,
            startingPrice,
            status,
            highestBid,
            bidIncrement,
            winner,
            approvalTime,
            vehicleAddress,
            missingDetails,
            note,
            startTime,
            endTime,
            refereId: referId,
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


const updateAuction = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        const {
            startingPrice, status, highestBid, bidIncrement, winner, approvalTime, vehicleAddress, missingDetails, note, startTime, endTime,
        } = req.body;

        const { error } = auctionUpdateSchema.validate({
            auctionId, startingPrice, status, highestBid, bidIncrement, winner, approvalTime, vehicleAddress, missingDetails, note, startTime, endTime,
        });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const existingAuction = await Auction.findById(auctionId);

        if (!existingAuction) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }

        if (startingPrice !== undefined) {
            existingAuction.startingPrice = startingPrice;
        }
        if (status !== undefined) {
            existingAuction.status = status;
        }
        if (highestBid !== undefined) {
            existingAuction.highestBid = highestBid;
        }
        if (bidIncrement !== undefined) {
            existingAuction.bidIncrement = bidIncrement;
        }
        if (winner !== undefined) {
            existingAuction.winner = winner;
        }
        if (approvalTime !== undefined) {
            existingAuction.approvalTime = approvalTime;
        }
        if (vehicleAddress !== undefined) {
            existingAuction.vehicleAddress = vehicleAddress;
        }
        if (missingDetails !== undefined) {
            existingAuction.missingDetails = missingDetails;
        }
        if (note !== undefined) {
            existingAuction.note = note;
        }
        if (startTime !== undefined) {
            existingAuction.startTime = startTime;
        }
        if (endTime !== undefined) {
            existingAuction.endTime = endTime;
        }

        await existingAuction.save();

        res.status(200).json({ status: 200, message: 'Auction updated successfully', auction: existingAuction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update auction' });
    }
};






module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    getAuctionsByCarId,
    updateAuction
};
