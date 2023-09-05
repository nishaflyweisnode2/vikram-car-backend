const express = require('express');
const router = express.Router();

const { createAuction, getAuctions, getAuctionById } = require('../controller/auctioncontroller');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/auction', authenticateUser, createAuction);
router.get('/getAllAuction', authenticateUser, authenticateAdmin, getAuctions);
router.get('/auction/:auctionId', getAuctionById);



module.exports = router;
