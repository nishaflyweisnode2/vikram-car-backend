const Joi = require('joi');
const mongoose = require('mongoose');

const Bid = require('../model/bidModel');
const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');

const { bidSchema, bidUpdateSchema } = require('../validation/bidvalidation');



exports.createBid = async (req, res) => {
    try {
        const userId = req.params.userId
        const { auctionId, amount } = req.body;

        const { error } = bidSchema.validate({ userId, auctionId, amount });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }

        if (auction.status !== 'Active') {
            return res.status(400).json({ status: 400, message: 'Auction is not currently active for bidding' });
        }

        const currentHighestBid = auction.highestBid;

        if (amount < currentHighestBid) {
            return res.status(400).json({ status: 400, message: 'Bid amount is Less Than Current Bid' });
        }

        if (amount <= currentHighestBid) {
            return res.status(400).json({ status: 400, message: 'Your bid must be higher than the current highest bid' });
        }

        const previousBid = await Bid.findOne({ bidStatus: "StartBidding", winStatus: "Underprocess" });

        if (previousBid) {
            previousBid.bidStatus = 'Losing';
            previousBid.winStatus = 'Reject';
            await previousBid.save();
        }

        const newBid = new Bid({
            auction: auctionId,
            bidder: userId,
            amount,
            currentBidAmount: amount,
        });

        auction.highestBid = amount;

        await newBid.save();
        await auction.bids.push(newBid._id);
        await auction.save();

        res.status(201).json(newBid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to create a bid' });
    }
};


exports.updateBid = async (req, res) => {
    try {
        const { bidId, amount, } = req.body;

        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        if (bid.bidStatus !== 'startBidding') {
            return res.status(400).json({ status: 400, message: 'This bid cannot be updated' });
        }

        if (amount <= bid.currentBidAmount) {
            return res.status(400).json({ status: 400, message: 'Your updated bid must be higher than the current highest bid' });
        }

        bid.amount = amount;
        bid.currentBidAmount = amount;

        const auction = await Auction.findById(bid.auction);
        auction.highestBid = amount;

        await bid.save();
        await auction.save();

        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to update the bid' });
    }
};


exports.approveBid = async (req, res) => {
    try {
        const { bidId, winStatus } = req.body;

        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        // if (bid.bidStatus !== 'winning') {
        //     return res.status(400).json({ status: 400, message: 'This bid cannot be approved/rejected' });
        // }

        bid.winStatus = winStatus;
        await bid.save();

        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to approve/reject the bid' });
    }
};


exports.updateBidStatus = async (req, res) => {
    try {
        const bidId = req.params.bidId;
        const { winStatus, bidStatus } = req.body;

        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        if (winStatus) {
            bid.winStatus = winStatus;
        }

        if (bidStatus) {
            bid.bidStatus = bidStatus;
        }

        await bid.save();

        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to update bid status' });
    }
};


exports.getBidsForAuction = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        const bids = await Bid.find({ auction: auctionId });
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to retrieve bids' });
    }
};


exports.getBidsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bids = await Bid.find({ bidder: userId });
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to retrieve bids' });
    }
};



exports.cancelBid = async (req, res) => {
    try {
        const bidId = req.params.bidId;
        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        if (bid.bidStatus !== 'startBidding') {
            return res.status(400).json({ status: 400, message: 'This bid cannot be canceled' });
        }

        await bid.remove();
        res.status(200).json({ status: 200, message: 'Bid canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to cancel the bid' });
    }
};


exports.startAutoBid = async (req, res) => {
    try {
        const bidId = req.params.bidId;
        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        bid.autobidEnabled = true;
        await bid.save();
        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to start auto-bidding' });
    }
};


exports.stopAutoBid = async (req, res) => {
    try {
        const bidId = req.params.bidId;
        const bid = await Bid.findById(bidId);

        if (!bid) {
            return res.status(404).json({ status: 404, message: 'Bid not found' });
        }

        bid.autobidEnabled = false;
        await bid.save();
        res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to stop auto-bidding' });
    }
};




