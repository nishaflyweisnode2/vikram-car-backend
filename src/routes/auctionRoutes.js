const express = require('express');
const router = express.Router();

const { createAuction, getAuctions, getAuctionById, getAuctionsByCarId, updateAuction } = require('../controller/auctioncontroller');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/auction', authenticateUser, createAuction);
router.get('/getAllAuction', authenticateUser, authenticateAdmin, getAuctions);
router.get('/auction/:auctionId', getAuctionById);
router.get('/auctions/by-car/:carId', getAuctionsByCarId);
router.put('/auctions/:auctionId', authenticateUser, updateAuction)



module.exports = router;
