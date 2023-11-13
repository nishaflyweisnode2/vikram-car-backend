const Joi = require('joi');
const mongoose = require('mongoose');

const Bid = require('../model/bidModel');
const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');
const MyBids = require('../model/myBidModel');


const { bidSchema, bidUpdateSchema } = require('../validation/bidvalidation');



// exports.createBid = async (req, res) => {
//     try {
//         const userId = req.params.userId
//         const { auctionId, amount } = req.body;

//         const { error } = bidSchema.validate({ userId, auctionId, amount });
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }

//         const auction = await Auction.findById(auctionId);
//         if (!auction) {
//             return res.status(404).json({ status: 404, message: 'Auction not found' });
//         }

//         if (auction.status !== 'Active') {
//             return res.status(400).json({ status: 400, message: 'Auction is not currently active for bidding' });
//         }

//         const currentHighestBid = auction.highestBid;

//         if (amount < currentHighestBid) {
//             return res.status(400).json({ status: 400, message: 'Bid amount is Less Than Current Bid' });
//         }

//         if (amount <= currentHighestBid) {
//             return res.status(400).json({ status: 400, message: 'Your bid must be higher than the current highest bid' });
//         }

//         const previousBid = await Bid.findOne({ auction: auctionId, bidStatus: "StartBidding", winStatus: "Underprocess" });

//         if (previousBid) {
//             previousBid.bidStatus = 'Losing';
//             previousBid.winStatus = 'Reject';
//             await previousBid.save();

//         }

//         const user = await userDb.findById(userId);
//         if (user && user.myBids.startBidAmount === 0) {
//             user.myBids.startBidAmount = amount;
//             await user.save();
//         }

//         if (previousBid) {
//             user.myBids.lastBidAmount = previousBid.amount;
//         }

//         if (user) {
//             user.myBids.currentBidAmount = amount;
//         }
//         await user.save();

//         const newBid = new Bid({
//             auction: auctionId,
//             bidder: userId,
//             amount,
//         });
//         console.log(newBid);

//         auction.highestBid = amount;

//         await newBid.save();
//         await auction.bids.push(newBid._id);
//         await auction.save();

//         res.status(201).json(newBid);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, message: 'Failed to create a bid' });
//     }
// };




exports.createBid = async (req, res) => {
    try {
        const userId = req.params.userId;
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
        const remainingTime = (new Date(auction.endTime) - new Date()) / 1000;
        console.log("remaningTime", remainingTime);

        if (amount <= currentHighestBid) {
            return res.status(400).json({ status: 400, message: 'Your bid must be higher than the current highest bid' });
        }

        if (amount < auction.startingPrice) {
            return res.status(400).json({ success: false, message: `Your bid must be equal to or higher than the starting price (${auction.startingPrice}). Please increase your bid amount.` });
        }


        if (remainingTime < 120 && amount > auction.finalPrice && !auction.timeExtended) {
            auction.endTime = new Date(auction.endTime.getTime() + 120000);
            auction.approvalTime = (new Date(auction.endTime) - new Date()).toString();
            auction.timeExtended = true;

            const previousBids = await Bid.find({ auction: auctionId, /*bidStatus: "StartBidding", winStatus: "Underprocess"*/ });
            for (const previousBid of previousBids) {
                previousBid.bidStatus = 'Losing';
                previousBid.winStatus = 'Reject';

                try {
                    await previousBid.save();
                } catch (error) {
                    console.error('Error updating previous bid:', error);
                }
            }
        } else if (amount >= auction.finalPrice) {
            console.log("Setting winner:", userId);
            auction.winner = userId;
            auction.status = 'Closed';
        } else {
            console.log("Bid amount doesn't match finalPrice.");
        }


        console.log("approvaltime", auction.approvalTime);

        // if (amount >= auction.finalPrice) {
        //     console.log("Setting winner:", userId);
        //     auction.winner = userId;
        //     auction.status = 'Closed';
        // } else {
        //     console.log("Bid amount doesn't match finalPrice.");
        // }

        const previousBid = await Bid.findOne({ auction: auctionId, bidStatus: "StartBidding", winStatus: "Underprocess" });

        if (previousBid) {
            previousBid.bidStatus = 'Losing';
            previousBid.winStatus = 'Reject';
            await previousBid.save();
        }

        let myBids = await MyBids.findOne({ user: userId, auction: auctionId });

        if (!myBids) {
            myBids = new MyBids({
                user: userId,
                auction: auctionId,
                startBidAmount: amount,
                currentBidAmount: amount,
                lastBidAmount: previousBid ? previousBid.amount : 0,
            });
        } else if (myBids.startBidAmount === 0) {
            myBids.startBidAmount = amount;
            myBids.currentBidAmount = amount;
        } else {
            // myBids.startBidAmount = amount;
            myBids.currentBidAmount = amount;
            myBids.lastBidAmount = previousBid ? previousBid.amount : 0;
        }

        if (amount >= auction.finalPrice) {
            myBids.winBidAmount = amount;
        }

        await myBids.save();

        const newBid = new Bid({
            auction: auctionId,
            bidder: userId,
            amount,
            bidStatus: amount >= auction.finalPrice ? 'Winning' : 'StartBidding',

        });

        auction.highestBid = amount;

        await newBid.save();

        await auction.bids.push(newBid._id);

        await auction.save();

        return res.status(201).json(newBid);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Failed to create a bid' });
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

            if (winStatus === 'Approve' && bidStatus === 'Winning') {
                const auction = await Auction.findById(bid.auction);
                if (auction) {
                    auction.winner = bid.bidder;
                    auction.status = "Closed";
                    await auction.save();
                }
            }
        }

        if (bidStatus) {
            bid.bidStatus = bidStatus;
        }

        await bid.save();

        const previousBids = await Bid.find({ auction: bid.auction, bidStatus: "StartBidding", winStatus: "Underprocess" });

        for (const previousBid of previousBids) {
            previousBid.bidStatus = 'Losing';
            previousBid.winStatus = 'Reject';
            await previousBid.save();
        }

        const userId = bid.bidder;
        const myBids = await MyBids.findOne({ user: userId, auction: bid.auction });

        if (myBids) {
            myBids.winBidAmount = bid.amount;
            myBids.lastBidAmount = bid.amount;
            await myBids.save();
        } else {
            return res.status(404).json({ status: 404, message: 'User does not have a bid for this auction' });
        }

        res.status(200).json({ status: 200, data: bid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to update bid status' });
    }
};


exports.getBidsForAuction = async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        const bids = await Bid.find({ auction: auctionId });
        res.status(200).json({ status: 200, data: bids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to retrieve bids' });
    }
};


exports.getBidsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bids = await Bid.find({ bidder: userId });
        res.status(200).json({ status: 200, data: bids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to retrieve bids' });
    }
};


exports.getBidsByUserAndAuction = async (req, res) => {
    try {
        const userId = req.params.userId;
        const auctionId = req.params.auctionId;
        const bids = await Bid.find({ bidder: userId, auction: auctionId });
        res.status(200).json({ status: 200, data: bids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to retrieve bids' });
    }
};


// exports.placeAutoBid = async (req, res) => {
//     try {
//         const { userId, auctionId } = req.params;
//         let { startBidAmount } = req.body;
//         const user = await userDb.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         const auction = await Auction.findOne({ status: "Active", auctionId });
//         if (!auction) {
//             return res.status(404).json({ success: false, message: 'Auction not found' });
//         }

//         if (!user.myBids.autobidEnabled) {
//             return res.status(400).json({ success: false, message: 'Auto-bidding is not enabled for this user' });
//         }

//         // const existingBids = await Bid.find({ auction: auctionId });
//         const existingBids = await Bid.find({ auction: auctionId, bidStatus: "StartBidding", winStatus: "Underprocess" });

//         if (existingBids.length > 0) {
//             console.log('Found existing bids:', existingBids);

//             const highestBidAmount = Math.max(...existingBids.map(bid => bid.amount));

//             if (startBidAmount <= highestBidAmount) {
//                 return res.status(400).json({ success: false, message: `Start bid amount must be higher than the highest existing bid (${highestBidAmount}). Please increase your bid amount.` });
//             }

//             for (const existingBid of existingBids) {
//                 existingBid.bidStatus = 'Losing';
//                 existingBid.winStatus = 'Backout';

//                 try {
//                     await existingBid.save();
//                     console.log('Updated existing bid:', existingBid);
//                 } catch (error) {
//                     console.error('Error updating existing bid:', error);
//                 }
//             }
//         }

//         user.myBids.startBidAmount = startBidAmount;
//         await user.save();

//         const newBidAmount = startBidAmount;

//         const newBid = new Bid({
//             auction: auctionId,
//             bidder: userId,
//             amount: newBidAmount,
//             bidStatus: 'StartBidding',
//             winStatus: 'Underprocess',
//         });

//         auction.highestBid = newBidAmount;

//         await newBid.save();
//         await auction.bids.push(newBid._id);
//         await auction.save();

//         return res.status(200).json({ status: 200, success: true, message: 'Auto-bid placed successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 200, success: false, message: 'Failed to place auto-bid' });
//     }
// };


exports.placeAutoBid = async (req, res) => {
    try {
        const { userId, auctionId } = req.params;
        let { startBidAmount } = req.body;
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const auction = await Auction.findOne({ status: "Active", auctionId });
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        if (startBidAmount < auction.startingPrice) {
            return res.status(400).json({ success: false, message: `Your bid must be equal to or higher than the starting price (${auction.startingPrice}). Please increase your bid amount.` });
        }

        let myBids = await MyBids.findOne({ user: userId, auction: auctionId });

        if (myBids) {
            if (!myBids || !myBids.autobidEnabled) {
                return res.status(400).json({ success: false, message: 'Auto-bidding is not enabled for this user' });
            }
        }

        const existingBids = await Bid.find({ auction: auctionId, bidStatus: "StartBidding", winStatus: "Underprocess" });

        if (existingBids.length > 0) {
            const highestBidAmount = Math.max(...existingBids.map(bid => bid.amount));

            if (startBidAmount <= highestBidAmount) {
                return res.status(400).json({ success: false, message: `Start bid amount must be higher than the highest existing bid (${highestBidAmount}). Please increase your bid amount.` });
            }

            for (const existingBid of existingBids) {
                existingBid.bidStatus = 'Losing';
                existingBid.winStatus = 'Backout';

                try {
                    await existingBid.save();
                } catch (error) {
                    console.error('Error updating existing bid:', error);
                }
            }
        }

        const remainingTime = (new Date(auction.endTime) - new Date()) / 1000;
        console.log("remaningTime", remainingTime);


        if (remainingTime < 120 && startBidAmount > auction.finalPrice && !auction.timeExtended) {
            auction.endTime = new Date(auction.endTime.getTime() + 120000);
            auction.approvalTime = (new Date(auction.endTime) - new Date()).toString();
            auction.timeExtended = true;

            const previousBids = await Bid.find({ auction: auctionId });
            for (const previousBid of previousBids) {
                previousBid.bidStatus = 'Losing';
                previousBid.winStatus = 'Reject';

                try {
                    await previousBid.save();
                } catch (error) {
                    console.error('Error updating previous bid:', error);
                }
            }
        } else if (startBidAmount >= auction.finalPrice) {
            console.log("Setting winner:", userId);
            auction.winner = userId;
            auction.status = 'Closed';
        } else {
            console.log("Bid amount doesn't match finalPrice.");
        }

        console.log("approvaltime", auction.approvalTime);


        if (!myBids) {
            myBids = new MyBids({
                user: userId,
                auction: auctionId,
                startBidAmount: startBidAmount,
                currentBidAmount: startBidAmount,
                lastBidAmount: existingBids.length > 0 ? Math.max(...existingBids.map(bid => bid.amount)) : 0,

            });
        } else if (myBids.startBidAmount === 0) {
            myBids.startBidAmount = startBidAmount;
            myBids.currentBidAmount = startBidAmount;
        } else {
            // myBids.startBidAmount = amount;
            myBids.currentBidAmount = startBidAmount;
            myBids.lastBidAmount = existingBids.length > 0 ? Math.max(...existingBids.map(bid => bid.amount)) : 0;
        }

        await myBids.save();

        const newBidAmount = startBidAmount;

        const newBid = new Bid({
            auction: auctionId,
            bidder: userId,
            amount: newBidAmount,
            bidStatus: 'StartBidding',
            winStatus: 'Underprocess',
            isAutobid: true,
        });

        auction.highestBid = newBidAmount;

        await newBid.save();
        await auction.bids.push(newBid._id);
        await auction.save();

        if (newBidAmount >= auction.finalPrice) {
            auction.status = 'Closed';
            auction.winner = userId;
            newBid.bidStatus = 'Winning';
            myBids.winBidAmount = newBidAmount;

            newBid.isAutobid = true;

            let message = '';
            if (newBidAmount >= auction.finalPrice) {
                message = 'Congratulations! You won the auction!';
            } else {
                message = 'You didn\'t win the auction. Better luck next time.';
            }

            const response = {
                status: 200,
                success: true,
                message: message,
            };
            await auction.save();
            await newBid.save();
            await myBids.save();

            return res.status(200).json(response);
        }

        await auction.save();
        await newBid.save();
        await myBids.save();

        const response = {
            status: 200,
            success: true,
            message: 'Auto-bid placed successfully You are currently the highest bidder. Keep an eye on the auction!',
        };

        // return res.status(200).json({ status: 200, success: true, message: 'Auto-bid placed successfully' });
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: 'Failed to place auto-bid' });
    }
};

exports.resetAutoBid = async (req, res) => {
    try {
        const { userId, auctionId } = req.params;
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        const myBids = await MyBids.findOne({ user: userId, auction: auctionId });
        if (!myBids) {
            return res.status(404).json({ success: false, message: 'User does not have a bid for this auction' });
        }

        myBids.startBidAmount = 0;
        myBids.currentBidAmount = 0;
        myBids.lastBidAmount = 0;
        myBids.winBidAmount = 0;

        await myBids.save();

        await Bid.updateMany(
            { auction: auctionId, bidder: userId, bidStatus: 'StartBidding', winStatus: 'Underprocess' },
            { $set: { isAutobid: false } }
        );

        res.status(200).json({ status: 200, success: true, message: 'Auto-bid settings reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, success: false, message: 'Failed to reset auto-bid settings' });
    }
};


exports.cancelAutoBid = async (req, res) => {
    try {
        const { userId, auctionId } = req.params;
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        const myBids = await MyBids.findOne({ user: userId, auction: auctionId });
        if (!myBids) {
            return res.status(404).json({ success: false, message: 'User does not have a bid for this auction' });
        }

        // myBids.autobidEnabled = false;
        // myBids.autobidMaxBidAmount = 0;
        // myBids.bidIncrementAmount = 0;
        // myBids.autobidMaxBids = 0;
        myBids.startBidAmount = 0;
        myBids.currentBidAmount = 0;
        myBids.lastBidAmount = 0;
        myBids.winBidAmount = 0;

        await myBids.save();

        await Bid.updateMany(
            { auction: auctionId, bidder: userId, bidStatus: 'StartBidding', winStatus: 'Underprocess' },
            { $set: { winStatus: 'Backout', isAutobid: false } }
        );

        res.status(200).json({ status: 200, success: true, message: 'Auto-bid settings canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, success: false, message: 'Failed to cancel auto-bid settings' });
    }
};



