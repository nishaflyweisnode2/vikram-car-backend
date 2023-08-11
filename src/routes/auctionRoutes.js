const express = require('express');
const router = express.Router();

const { createAuction } = require('../controller/auctioncontroller');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/auction', authenticateUser, authenticateAdmin, createAuction);



module.exports = router;
