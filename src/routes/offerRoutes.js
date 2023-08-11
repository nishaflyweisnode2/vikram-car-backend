const express = require('express');
const router = express.Router();

const { createOffer, getAllOffers } = require('../controller/offerController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/create', authenticateUser, authenticateAdmin, createOffer);
router.get('/offers', authenticateUser, getAllOffers);



module.exports = router;
