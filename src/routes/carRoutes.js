const express = require('express');
const router = express.Router();
const { createCar, updateCar, getCars, getCarById, updateCarImage, getCarsByBuyingOption, searchCars, compareCars, buyCar, addCarRating, getCarRatings } = require('../controller/carController');
const { authenticateUser, authorizeUser, authorization, authenticateAdmin, authenticateVendor } = require("../middleware/auth");



router.post('/create-car', authenticateUser, authenticateAdmin, createCar);
router.put('/create-car/:id', authenticateUser, authenticateAdmin, updateCar);
router.post('/admin/create-car', authenticateVendor, createCar);
router.get('/car', authenticateUser, getCars);
router.get('/:carId', getCarById);
router.put('/update/:carId/image', authenticateUser, authenticateAdmin, updateCarImage);
router.put('/admin/update/:carId/image', authenticateVendor, updateCarImage);
router.get('/cars/:buyingOption', authenticateUser, getCarsByBuyingOption);
router.get('/search', authenticateUser, searchCars);
router.get('/compare', authenticateUser, compareCars);
router.post('/buyCar/:userId', authenticateUser, authorization, buyCar);
router.post('/users/:userId/rateCar', authenticateUser, authorization, addCarRating);
router.get('/cars/:carId/ratings', authenticateUser, getCarRatings);




module.exports = router;
