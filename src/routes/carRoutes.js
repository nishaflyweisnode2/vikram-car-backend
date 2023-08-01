const express = require('express');
const router = express.Router();
const { createCar, getCarsByBuyingOption } = require('../controller/carController');


// Route for creating a new car
router.post('/create-car', createCar);
router.get('/cars/:buyingOption', getCarsByBuyingOption);


module.exports = router;
