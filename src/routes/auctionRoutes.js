const express = require('express');
const router = express.Router();
const { createAuction } = require('../controller/auctioncontroller');


router.post('/auction', createAuction);

module.exports = router;
