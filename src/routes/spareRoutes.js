const express = require('express');
const router = express.Router();
const { createSparePart, getAllSpareParts, getSpecificSparePart, searchSpareParts } = require('../controller/spareController');



router.post('/spareParts', createSparePart);

router.get('/getAllSpareParts', getAllSpareParts);

router.get('/:sparePartId', getSpecificSparePart);

router.get('/spare-parts/search', searchSpareParts);





module.exports = router;
