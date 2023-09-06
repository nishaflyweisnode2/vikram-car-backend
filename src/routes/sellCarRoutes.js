const express = require('express');
const router = express.Router();

const { sellCar, updateSellCarImage, getAllSellCars } = require('../controller/sellCarController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/sellCar', authenticateUser, sellCar);
router.put('/update/:carId/image', authenticateUser, updateSellCarImage);
router.get('/sell', authenticateUser, getAllSellCars);


module.exports = router;
