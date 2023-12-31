const mongoose = require('mongoose');
const Bid = require('../model/bidModel');
const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');
const MyBids = require('../model/myBidModel');
const SecurityDeposit = require('../model/depositeModel');



let response;


async function placeAutoBidFunction(req, userId, auctionId, startBidAmount, myBids, auction, res,) {
    console.log("Entering placeAutoBidFunction");
    console.log("startBidAmount1", startBidAmount);

    try {
        const user = await userDb.findById(userId);
        if (!user) {
            response = {
                status: 400,
                success: false,
                message: 'User not found'
            };
            return response;
        }

        auction = await Auction.findOne({ status: "Active", auctionId, isAutobid: true });
        console.log("auction", auction);
        if (!auction) {
            response = {
                status: 400,
                success: false,
                message: 'Auction not found'
            };
            return response;
        }

        if (startBidAmount < auction.startingPrice) {
            response = {
                status: 400,
                success: false,
                message: `Your bid must be equal to or higher than the starting price (${auction.startingPrice}). Please increase your bid amount.`
            };
            return response;
        }

        myBids = await MyBids.findOne({ user: userId, auction: auctionId, remaningBidLimit: { $gte: 0 } });

        if (myBids) {
            if (!myBids || !myBids.autobidEnabled) {
                response = {
                    status: 400,
                    success: false,
                    message: 'Auto-bidding is not enabled for this user'
                };
                return response;
            }
        }

        const existingBids = await Bid.find({
            auction: auctionId, bidStatus: { $in: ["StartBidding", "Losing"] },
            winStatus: "Underprocess"
        });

        if (existingBids.length > 0) {
            const highestBidAmount = Math.max(...existingBids.map(bid => bid.amount));

            for (const existingBid of existingBids) {
                existingBid.bidStatus = 'Losing';
                existingBid.winStatus = 'Reject';

                try {
                    await existingBid.save();
                } catch (error) {
                    console.error('Error updating existing bid:', error);
                }
            }
        }

        const remainingTime = (new Date(auction.endTime) - new Date()) / 1000;
        console.log("Remaining Time:", remainingTime);

        if (remainingTime < 120 && startBidAmount > auction.finalPrice && !auction.timeExtended) {
            auction.endTime = new Date(auction.endTime.getTime() + 120000);
            auction.approvalTime = (new Date(auction.endTime) - new Date()).toString();
            auction.timeExtended = true;

            const previousBids = await Bid.find({ auction: auctionId, bidStatus: { $in: ["StartBidding", "Losing"] }, winStatus: "Underprocess" });
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

        console.log("Approval Time:", auction.approvalTime);

        const securityDeposit = await SecurityDeposit.findOne({ user: userId })
            .sort({ createdAt: -1 })
            .limit(1);

        if (!securityDeposit) {
            response = {
                status: 400,
                success: false,
                message: 'Security deposit not found. Please add some amount to bid.'
            };
            return response;
        }

        const currentHighestBidForuser = myBids.currentBidAmount;
        if (startBidAmount <= currentHighestBidForuser) {
            response = {
                status: 400,
                success: false,
                message: `Your bid must be higher than the current highest bid price of you (${myBids.currentBidAmount}).`
            };
            return response;
        }

        if (!myBids) {
            myBids = new MyBids({
                user: userId,
                auction: auctionId,
                startBidAmount: startBidAmount,
                currentBidAmount: startBidAmount,
                lastBidAmount: existingBids.length > 0 ? Math.max(...existingBids.map(bid => bid.amount)) : 0,
                bidIncrementAmount: auction.bidIncrement,
                bidLimit: securityDeposit.biddingLimit,
                securityDeposit: securityDeposit._id,
            });
        } else if (myBids.startBidAmount === 0) {
            myBids.startBidAmount = startBidAmount;
            myBids.currentBidAmount = startBidAmount;
        } else {
            const proposedBidAmount = startBidAmount - myBids.currentBidAmount;

            console.log("Start Bid Amount1:", startBidAmount);
            console.log("Proposed Bid Amount1:", proposedBidAmount);

            if (myBids.bidLimit > 0) {
                const remainingBidLimit = myBids.bidLimit - startBidAmount;
                console.log("remainingBidLimit:", remainingBidLimit);

                if (remainingBidLimit < 0) {
                    myBids.isAutobid = false;
                    const latestSecurityDeposit = await SecurityDeposit.findOne({ user: userId })
                        .sort({ createdAt: -1 })
                        .limit(1);

                    if (latestSecurityDeposit && latestSecurityDeposit._id !== myBids.securityDeposit) {
                        if (latestSecurityDeposit.biddingLimit >= startBidAmount) {
                            myBids.bidLimit = latestSecurityDeposit.biddingLimit;
                            myBids.securityDeposit = latestSecurityDeposit._id;
                            myBids.remaningBidLimit = latestSecurityDeposit.biddingLimit - startBidAmount;
                        } else {
                            response = {
                                status: 400,
                                success: false,
                                message: `Your bid increment exceeds the allowed bid increment amount of ${myBids.bidIncrementAmount}.`
                            };
                            return response;
                        }
                    } else {
                        response = {
                            status: 400,
                            success: false,
                            message: `Your remaining bid limit is not sufficient for this bid.`
                        };
                        return response;
                    }
                } else {
                    myBids.remaningBidLimit = remainingBidLimit;

                }
            }
            if (proposedBidAmount > myBids.bidIncrementAmount) {
                response = {
                    status: 400,
                    success: false,
                    message: `Your bid increment exceeds the allowed bid increment amount of ${myBids.bidIncrementAmount}.`
                };
                return response;
            }

            myBids.currentBidAmount = startBidAmount;
            myBids.lastBidAmount = existingBids.length > 0 ? Math.max(...existingBids.map(bid => bid.amount)) : 0;
        }

        await myBids.save();

        const newBidAmount = startBidAmount;

        const newBid = new Bid({
            auction: auctionId,
            bidder: userId,
            amount: newBidAmount,
            bidStatus: newBidAmount >= auction.finalPrice ? 'Winning' : 'Losing',
            winStatus: 'Underprocess',
            isAutobid: true,
        });

        if (newBidAmount >= auction.highestBid) {
            auction.highestBid = newBidAmount;
        }

        await newBid.save();
        await auction.bids.push(newBid._id);
        await auction.save();
        await myBids.save();

        if (newBidAmount >= auction.finalPrice) {
            auction.status = 'Closed';
            auction.winner = userId;
            newBid.bidStatus = 'Winning';
            myBids.winBidAmount = newBidAmount;
            myBids.isAutobid = false;
            newBid.isAutobid = true;

            await auction.save();
            await myBids.save();
            await newBid.save();


            let message = '';
            if (newBidAmount >= auction.finalPrice) {
                message = 'Congratulations! You won the auction!';
            } else {
                message = 'You didn\'t win the auction. Better luck next time.';
            }

            response = {
                status: 200,
                success: true,
                message: message,
            };


            console.log("Exiting placeAutoBidFunction - Auction won or closed");
            return response;
        } else {
            response = {
                status: 200,
                success: true,
                message: 'Auto-bid placed successfully. You are currently the highest bidder. Keep an eye on the auction!',
            };

            console.log("Exiting placeAutoBidFunction - Auto-bid placed successfully");
            return response;
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        response = {
            status: 500,
            success: false,
            message: 'Internal Server Error',
        };
        return response;
    }
}

module.exports = placeAutoBidFunction;