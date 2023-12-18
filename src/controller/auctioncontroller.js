const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const Bid = require('../model/bidModel');
const MyBids = require('../model/myBidModel');
const mongoose = require('mongoose');

const { DateTime } = require('luxon');


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

        const endTimeDate = DateTime.fromISO(endTime);
        const currentTime = DateTime.now();
        const remainingTime = endTimeDate.diff(currentTime, ['hours', 'minutes']);

        const approvalTime = `${remainingTime.hours.toString().padStart(2, '0')}:${remainingTime.minutes.toString().padStart(2, '0')}`;


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


const activateAuction = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;

        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        const currentTime = new Date();
        console.log("currentTime", currentTime);
        const startTime = auction.startTime;
        console.log("startTime", startTime);
        const endTime = auction.endTime;
        console.log("endTime", endTime);


        if (currentTime >= startTime && currentTime < endTime) {
            auction.status = 'Active';
            console.log(auction);
            await auction.save();
            return res.status(200).json(auction);
        } else {
            return res.status(400).json({ message: 'Auction cannot be activated at this time' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Auction activation failed' });
    }
};


const closeAuction = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;

        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (auction.status !== 'Active') {
            return res.status(400).json({ message: 'Auction can only be closed when it is in the "Active" status' });
        }

        const highestBid = await Bid.findOne({ auction: auctionId }).sort({ amount: -1 });

        if (highestBid) {
            auction.winner = highestBid.bidder;
            auction.finalPrice = highestBid.amount;
            auction.status = 'Closed';
        } else {
            auction.winner = null;
            auction.finalPrice = auction.startingPrice;
            auction.status = 'Closed';
        }

        await auction.save();

        res.status(200).json(auction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Auction closing failed' });
    }
};

// function for update status start
const checkAndUpdateAuctionStatus = async () => {
    try {
        const currentTime = new Date();

        const auctionsToClose = await Auction.find({
            $or: [{ status: 'Active' }, { status: 'Pending' }],
            endTime: { $lte: currentTime },
        });

        for (const auction of auctionsToClose) {
            auction.status = 'Closed';
            await auction.save();
        }
    } catch (error) {
        console.error('Error checking and updating auction status:', error);
    }
};

const handleExistingAuctions = async () => {
    try {
        const currentTime = new Date();

        const existingAuctions = await Auction.find({
            $or: [{ status: 'Active' }, { status: 'Pending' }],
            endTime: { $lte: currentTime },
        });

        for (const auction of existingAuctions) {
            auction.status = 'Closed';
            await auction.save();
        }
    } catch (error) {
        console.error('Error handling existing auctions:', error);
    }
};

const intervalInMinutes = 1;
setInterval(checkAndUpdateAuctionStatus, intervalInMinutes * 60 * 1000);

handleExistingAuctions();
// function for update status End


const updateUserBids = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { myBids } = req.body;

        const user = await userDb.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        let myBid = await MyBids.findOne({ user: userId, auction: myBids.auction });

        if (!myBid) {
            myBid = new MyBids({
                user: userId,
                auction: myBids.auction,
            });
        }

        for (const field in myBids) {
            if (myBids.hasOwnProperty(field)) {
                myBid[field] = myBids[field];
            }
        }

        await myBid.save();

        res.status(200).json(myBid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to update user bids' });
    }
};



const updateFinalPrice = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        const finalPrice = req.body.finalPrice;

        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ status: 404, success: false, message: 'Auction not found' });
        }

        auction.finalPrice = finalPrice;

        await auction.save();

        return res.status(200).json({ status: 200, success: true, message: 'Final price updated successfully', auction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: 'Failed to update final price' });
    }
};



const auctionHint1 = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;

        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        const highestBid = await Bid.findOne({ auction: auctionId }).sort({ amount: -1 });

        return res.status(200).json({
            success: true,
            auction: {
                startingPrice: auction.startingPrice,
                finalPrice: auction.finalPrice,
                highestBid: highestBid ? highestBid.amount : 0,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to get auction details' });
    }
};


const auctionHint = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        const userId = req.params.userId;

        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        const highestBid = await Bid.findOne({ auction: auctionId }).sort({ amount: -1 });


        const userBid = await Bid.findOne({ auction: auctionId, bidder: userId }).sort({ createdAt: -1 });

        console.log("1", userId);
        console.log(userBid);

        return res.status(200).json({
            success: true,
            auction: {
                startingPrice: auction.startingPrice,
                finalPrice: auction.finalPrice,
                highestBid: auction.highestBid,
                endTime: auction.endTime,
            },
            userBidStatus: userBid ? userBid.bidStatus : 'StartBidding',
            userWintatus: userBid ? userBid.winStatus : 'Underprocess',
            userHighestBid: highestBid ? highestBid.amount : 0,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to get auction details' });
    }
};






module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    getAuctionsByCarId,
    updateAuction,
    activateAuction,
    closeAuction,
    updateUserBids,
    updateFinalPrice,
    auctionHint
};
