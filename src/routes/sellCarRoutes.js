const express = require('express');
const router = express.Router();
const { sellCar, updateSellCarImage } = require('../controller/sellCarController');

router.post('/sellCar', sellCar);
router.put('/update/:carId/image', updateSellCarImage);


module.exports = router;
