const express = require('express');
const router = express.Router();

const auth = require('../controller/bidController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");




router.post('/bids/:userId', authenticateUser, auth.createBid)
router.get('/bids', authenticateUser, auth.getBid)
router.put('/bids/:bidId', authenticateUser, auth.updateBid)
router.put('/user/:userId/bidding-settings/:bidId', authenticateUser, auth.updateUserBiddingSettings);




module.exports = router;
