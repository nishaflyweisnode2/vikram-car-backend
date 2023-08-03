const express = require('express');
const router = express.Router();
const { createSparePart, getAllSpareParts } = require('../controller/spareController');



router.post('/spareParts', createSparePart);

router.get('/getAllSpareParts', getAllSpareParts);





module.exports = router;
