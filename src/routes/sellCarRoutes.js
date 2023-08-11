const express = require('express');
const router = express.Router();

const { sellCar, updateSellCarImage } = require('../controller/sellCarController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/sellCar', authenticateUser, sellCar);
router.put('/update/:carId/image', authenticateUser, updateSellCarImage);


module.exports = router;
