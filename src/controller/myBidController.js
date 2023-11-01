const MyBids = require('../model/myBidModel');
const User = require('../model/userModel');
const Auction = require('../model/auctionModel');


exports.createMyBids = async (req, res) => {
    try {
        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const auction = await Auction.findById(req.body.auction);
        if (!auction) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }

        const newMyBids = new MyBids(req.body);
        await newMyBids.save();

        return res.status(201).json({ status: 201, data: newMyBids });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Failed to create MyBids document' });
    }
};


exports.getMyBidsById = async (req, res) => {
    try {
        const myBidsId = req.params.myBidsId;
        const myBids = await MyBids.findById(myBidsId);
        if (!myBids) {
            return res.status(404).json({ status: 404, message: 'MyBids document not found' });
        }
        return res.status(200).json({ status: 200, data: myBids });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Failed to retrieve MyBids document' });
    }
};


exports.updateMyBidsById = async (req, res) => {
    try {
        const myBidsId = req.params.myBidsId;
        const updates = req.body;
        const myBids = await MyBids.findByIdAndUpdate(myBidsId, updates, { new: true });
        if (!myBids) {
            return res.status(404).json({ status: 404, message: 'MyBids document not found' });
        }
        return res.status(200).json({ status: 200, data: myBids });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Failed to update MyBids document' });
    }
};


exports.deleteMyBidsById = async (req, res) => {
    try {
        const myBidsId = req.params.myBidsId;
        const myBids = await MyBids.findByIdAndRemove(myBidsId);
        if (!myBids) {
            return res.status(404).json({ status: 404, message: 'MyBids document not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Failed to delete MyBids document' });
    }
};
