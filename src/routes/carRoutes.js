const express = require('express');
const router = express.Router();
const { createCar, updateCarImage, getCarsByBuyingOption, searchCars, compareCars, buyCar } = require('../controller/carController');
const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



// Route for creating a new car
router.post('/create-car', createCar);
router.put('/update/:carId/image', updateCarImage);
router.get('/cars/:buyingOption', getCarsByBuyingOption);
router.get('/search', searchCars);
router.get('/compare', compareCars);
router.post('/buyCar/:userId', authenticateUser, authorization, buyCar);




module.exports = router;
