const express = require('express');
const router = express.Router();

const { createSparePart, getAllSpareParts, getSpecificSparePart, searchSpareParts, buySparePart, updateSpareImage } = require('../controller/spareController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/spareParts', authenticateUser, authenticateAdmin, createSparePart);

router.get('/getAllSpareParts', authenticateUser, getAllSpareParts);

router.get('/:sparePartId', authenticateUser, getSpecificSparePart);

router.get('/spare-parts/search', authenticateUser, searchSpareParts);

router.post('/spare-parts/buy', authenticateUser, buySparePart);

router.put('/update/:sparePartId/image', authenticateUser, updateSpareImage);




module.exports = router;
