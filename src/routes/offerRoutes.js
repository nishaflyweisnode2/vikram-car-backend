const express = require('express');
const router = express.Router();

const { createOffer, upload, getAllOffers, updateOffer } = require('../controller/offerController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/create', upload.single('image'), authenticateUser, authenticateAdmin, createOffer);
router.get('/offers', authenticateUser, getAllOffers);
// router.put('/offers/:offerId/update', authenticateUser, updateOffer);




module.exports = router;
