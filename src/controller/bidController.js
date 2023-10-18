const Joi = require('joi');
const mongoose = require('mongoose');

const Bid = require('../model/bidModel');
const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');

const { bidSchema, bidUpdateSchema } = require('../validation/bidvalidation');





const createBid = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const { auction, bidAmount } = req.body;

        const { error } = bidSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await userDb.findById(userId);
        if (!user || user.length === 0) {
            return res.status(404).json({ status: 404, message: 'No user found for this userId' });
        }

        const auctionData = await Auction.findById(auction);

        if (!auctionData) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }

        if (bidAmount > auctionData.bidLimit) {
            return res.status(400).json({ status: 400, message: 'Bid amount exceeds the limit' });
        }

        const minBidAmount = auctionData.highestBid + auctionData.bidIncrement;

        if (bidAmount < minBidAmount) {
            return res.status(400).json({ status: 400, message: 'Bid amount is too low' });
        }

        const newBid = new Bid({
            user: user._id,
            auction,
            bidAmount,
            bidIncrement: auctionData.bidIncrement,
            lastBidAmount: auctionData.highestBid,
        });

        await newBid.save();

        auctionData.highestBid = bidAmount;
        await auctionData.save();

        return res.status(201).json({ status: 201, data: newBid });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Bid placement failed' });
    }
};


const getBid = async (req, res) => {
    try {
        const bids = await Bid.find();
        res.status(200).json({ status: 200, data: bids });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch bids' });
    }
};


const updateBid = async (req, res) => {
    try {
        const bidId = req.params.bidId;

        const {
            bidAmount,
            autobidEnabled,
            autobidMaxBidAmount,
            bidIncrement,
            lastBidAmount,
            autobidMaxBids,
            bidLimit,
            autoDecreaseEnabled,
            decrementAmount,
            bidStatus,
            bidTime,
        } = req.body;

        const { error } = bidUpdateSchema.validate({
            bidId,
            bidAmount,
            autobidEnabled,
            autobidMaxBidAmount,
            bidIncrement,
            lastBidAmount,
            autobidMaxBids,
            bidLimit,
            autoDecreaseEnabled,
            decrementAmount,
            bidStatus,
            bidTime,
        });

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingBid = await Bid.findById(bidId);

        if (!existingBid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        if (bidAmount !== undefined) {
            existingBid.bidAmount = bidAmount;
        }
        if (autobidEnabled !== undefined) {
            existingBid.autobidEnabled = autobidEnabled;
        }
        if (autobidMaxBidAmount !== undefined) {
            existingBid.autobidMaxBidAmount = autobidMaxBidAmount;
        }
        if (bidIncrement !== undefined) {
            existingBid.bidIncrement = bidIncrement;
        }
        if (lastBidAmount !== undefined) {
            existingBid.lastBidAmount = lastBidAmount;
        }
        if (autobidMaxBids !== undefined) {
            existingBid.autobidMaxBids = autobidMaxBids;
        }
        if (bidLimit !== undefined) {
            existingBid.bidLimit = bidLimit;
        }
        if (autoDecreaseEnabled !== undefined) {
            existingBid.autoDecreaseEnabled = autoDecreaseEnabled;
        }
        if (decrementAmount !== undefined) {
            existingBid.decrementAmount = decrementAmount;
        }
        if (bidStatus !== undefined) {
            existingBid.bidStatus = bidStatus;
        }
        if (bidTime !== undefined) {
            existingBid.bidTime = bidTime;
        }

        await existingBid.save();

        return res.status(200).json({ status: 200, message: 'Bid updated successfully', bid: existingBid });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update bid' });
    }
};

// const updateUserBiddingSettings = async (req, res) => {
//     const { userId, bidId } = req.params;
//     const updatedBiddingSettings = req.body;

//     try {
//         const user = await userDb.findById(userId);

//         if (!user) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }

//         const existingBid = await Bid.findById(bidId);

//         if (!existingBid) {
//             return res.status(404).json({ status: 404, message: 'Bid not found' });
//         }

//         if (!existingBid.user || existingBid.user.toString() !== userId) {
//             return res.status(403).json({ status: 403, message: 'Unauthorized to update this bid' });
//         }

//         existingBid.autobidEnabled = updatedBiddingSettings.autobidEnabled;
//         existingBid.autobidMaxBidAmount = updatedBiddingSettings.autobidMaxBidAmount;
//         existingBid.bidIncrement = updatedBiddingSettings.bidIncrement;
//         existingBid.lastBidAmount = updatedBiddingSettings.lastBidAmount;
//         existingBid.autobidMaxBids = updatedBiddingSettings.autobidMaxBids;
//         existingBid.bidLimit = updatedBiddingSettings.bidLimit;
//         existingBid.autoDecreaseEnabled = updatedBiddingSettings.autoDecreaseEnabled;
//         existingBid.decrementAmount = updatedBiddingSettings.decrementAmount;
//         existingBid.startBidAmount = updatedBiddingSettings.startBidAmount;
//         existingBid.currentBidAmount = updatedBiddingSettings.currentBidAmount;
//         existingBid.bidStatus = updatedBiddingSettings.bidStatus;

//         await existingBid.save();

//         const myBidIndex = user.myBids.findIndex(b => b.bid && b.bid.toString() === bidId);
//         console.log("myBidIndex", myBidIndex);


//         if (myBidIndex !== -1) {
//             console.log("Updating user.myBids...");
//             user.myBids[myBidIndex].autobidEnabled = updatedBiddingSettings.autobidEnabled;
//             user.myBids[myBidIndex].autobidMaxBidAmount = updatedBiddingSettings.autobidMaxBidAmount;
//             user.myBids[myBidIndex].bidIncrement = updatedBiddingSettings.bidIncrement;
//             user.myBids[myBidIndex].lastBidAmount = updatedBiddingSettings.lastBidAmount;
//             user.myBids[myBidIndex].autobidMaxBids = updatedBiddingSettings.autobidMaxBids;

//         }

//         console.log("Saving user...");
//         await user.save();


//         return res.status(200).json({
//             status: 200,
//             message: 'Bidding settings updated successfully',
//             existingBid,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to update bidding settings' });
//     }
// };



const updateUserBiddingSettings = async (req, res) => {
    const { userId, bidId } = req.params;
    const updatedBiddingSettings = req.body;

    try {
        const user = await userDb.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const existingBid = await Bid.findById(bidId);

        if (!existingBid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        if (!existingBid.user || existingBid.user.toString() !== userId) {
            return res.status(403).json({ status: 403, message: 'Unauthorized to update this bid' });
        }

        existingBid.autobidEnabled = updatedBiddingSettings.autobidEnabled;
        existingBid.autobidEnabled = updatedBiddingSettings.autobidEnabled;
        existingBid.autobidMaxBidAmount = updatedBiddingSettings.autobidMaxBidAmount;
        existingBid.bidIncrement = updatedBiddingSettings.bidIncrement;
        existingBid.lastBidAmount = updatedBiddingSettings.lastBidAmount;
        existingBid.autobidMaxBids = updatedBiddingSettings.autobidMaxBids;
        existingBid.bidLimit = updatedBiddingSettings.bidLimit;
        existingBid.autoDecreaseEnabled = updatedBiddingSettings.autoDecreaseEnabled;
        existingBid.decrementAmount = updatedBiddingSettings.decrementAmount;
        existingBid.startBidAmount = updatedBiddingSettings.startBidAmount;
        existingBid.currentBidAmount = updatedBiddingSettings.currentBidAmount;
        existingBid.bidStatus = updatedBiddingSettings.bidStatus;

        await existingBid.save();
        const myBidIndex = user.myBids
        console.log(myBidIndex);

        const myBidIndex1 = user.myBids.find(bid===bidId);
        console.log(myBidIndex1);

        // if (myBidIndex !== -1) {
        //     console.log("Updating user.myBids...");
        //     user.myBids[myBidIndex].autobidEnabled = updatedBiddingSettings.autobidEnabled;
        //     user.myBids[myBidIndex].autobidMaxBidAmount = updatedBiddingSettings.autobidMaxBidAmount;
        //     user.myBids[myBidIndex].bidIncrement = updatedBiddingSettings.bidIncrement;
        //     user.myBids[myBidIndex].lastBidAmount = updatedBiddingSettings.lastBidAmount;
        //     user.myBids[myBidIndex].autobidMaxBids = updatedBiddingSettings.autobidMaxBids;
        // }

        // await user.save();

        return res.status(200).json({
            status: 200,
            message: 'Bidding settings updated successfully',
            existingBid,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update bidding settings' });
    }
};



module.exports = { createBid, getBid, updateBid, updateUserBiddingSettings };
