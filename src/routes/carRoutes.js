const express = require('express');
const router = express.Router();
const { createCar, updateCarImage, getCarsByBuyingOption, searchCars, compareCars, buyCar } = require('../controller/carController');
const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/create-car', authenticateUser, authenticateAdmin, createCar);
router.put('/update/:carId/image', authenticateUser, authenticateAdmin, updateCarImage);
router.get('/cars/:buyingOption', authenticateUser, getCarsByBuyingOption);
router.get('/search', authenticateUser, searchCars);
router.get('/compare', authenticateUser, compareCars);
router.post('/buyCar/:userId', authenticateUser, authorization, buyCar);




module.exports = router;
