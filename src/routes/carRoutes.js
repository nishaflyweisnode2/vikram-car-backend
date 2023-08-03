const express = require('express');
const router = express.Router();
const { createCar, updateCarImage, getCarsByBuyingOption, searchCars, compareCars } = require('../controller/carController');


// Route for creating a new car
router.post('/create-car', createCar);
router.put('/update/:carId/image', updateCarImage);
router.get('/cars/:buyingOption', getCarsByBuyingOption);
router.get('/search', searchCars);
router.get('/compare', compareCars);



module.exports = router;
