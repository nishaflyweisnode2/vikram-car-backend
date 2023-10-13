const express = require('express');
const router = express.Router();

const auth = require('../controller/bidController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");




router.post('/bids', authenticateUser, auth.createBid)
router.get('/bids', authenticateUser, auth.getBid)
router.put('/bids/:bidId', authenticateUser, auth.updateBid)



module.exports = router;
