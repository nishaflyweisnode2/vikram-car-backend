const express = require('express');
const router = express.Router();
const { createSparePart, getAllSpareParts, getSpecificSparePart, searchSpareParts, buySparePart, updateSpareImage } = require('../controller/spareController');



router.post('/spareParts', createSparePart);

router.get('/getAllSpareParts', getAllSpareParts);

router.get('/:sparePartId', getSpecificSparePart);

router.get('/spare-parts/search', searchSpareParts);

router.post('/spare-parts/buy', buySparePart);

router.put('/update/:sparePartId/image', updateSpareImage);




module.exports = router;
