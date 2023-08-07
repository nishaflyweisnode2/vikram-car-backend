const express = require('express');
const router = express.Router();
const { createOffer, getAllOffers } = require('../controller/offerController');


router.post('/create', createOffer);
router.get('/offers', getAllOffers);



module.exports = router;
