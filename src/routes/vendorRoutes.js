require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, loginWithEmail, getAllCars, getNewCars, getUsedCars, searchCars, getAllUser, getLatestUser } = require("../controller/vendorController");

const { authenticateVendor,
    authorizeVendor,
    vendorAuthorization, authenticateUser } = require("../middleware/auth");
const { createCity, getAllCity } = require('../controller/cityController');
const limitController = require('../controller/vendorController');




// user
router.post('/signup', signup);
router.post('/login-email', loginWithEmail)
router.get('/cars', authenticateVendor, getAllCars);
router.get('/new-cars', authenticateVendor, getNewCars);
router.get('/used-cars', authenticateVendor, getUsedCars);
router.get('/search', authenticateVendor, searchCars);
router.get('/admin/getAllUser', authenticateVendor, getAllUser);
router.get('/getLatestUser', authenticateVendor, getLatestUser);





//cityName
router.post('/cities', authenticateVendor, createCity)
router.get('/admin/cities/getAllCity', authenticateVendor, getAllCity);


router.post('/limits', authenticateVendor, limitController.createLimit);
router.get('/limits', authenticateVendor, limitController.getLimits);
router.put('/limits/:id', authenticateVendor, limitController.updateLimit);
router.delete('/limits/:id', authenticateVendor, limitController.deleteLimit);





router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;