const express = require('express');
const router = express.Router();

const auth = require('../controller/bidController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");




router.post('/bids/:userId', authenticateUser, auth.createBid)
router.put('/bids/update', authenticateUser, auth.updateBid);
router.put('/bids/approve', authenticateUser, auth.approveBid);
router.put('/admin/bid/:bidId/status', authenticateUser, auth.updateBidStatus);
router.get('/bids/auction/:auctionId', authenticateUser, auth.getBidsForAuction);
router.get('/bids/user/:userId', authenticateUser, auth.getBidsByUser);
router.post('/bids/autoBid/:userId/:auctionId', authenticateUser, auth.placeAutoBid);
router.put('/auto-bid/reset/:userId/:auctionId', authenticateUser, auth.resetAutoBid);
router.post('/cancel/:userId/:auctionId', authenticateUser, auth.cancelAutoBid);



module.exports = router;
