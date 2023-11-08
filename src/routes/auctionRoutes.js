const express = require('express');
const router = express.Router();

const { createAuction, getAuctions, getAuctionById, getAuctionsByCarId, updateAuction, activateAuction, closeAuction, updateUserBids, updateFinalPrice, auctionHint } = require('../controller/auctioncontroller');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/auction', authenticateUser, createAuction);
router.get('/getAllAuction', authenticateUser, authenticateAdmin, getAuctions);
router.get('/auction/:auctionId', getAuctionById);
router.get('/auctions/by-car/:carId', getAuctionsByCarId);
router.put('/auctions/:auctionId', authenticateUser, updateAuction)
router.put('/activate/:auctionId', authenticateUser, activateAuction);
router.put('/close/:auctionId', authenticateUser, closeAuction);
router.put('/:userId/myBids', authenticateUser, authenticateAdmin, updateUserBids);
router.put('/auctions/:auctionId/update-final-price', authenticateUser, authenticateAdmin, updateFinalPrice);
router.get('/auctions/:auctionId/details/:userId', authenticateUser, auctionHint);




module.exports = router;
