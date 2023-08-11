require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, loginWithMobile, loginWithEmail, selectCity, addToFavourites, updateWorkProfile, updateDocuments, updatePanCardImageImage, updateAadharCardImage, updateOtherDocumentImage, getAllCars, getNewCars, getUsedCars, searchCars } = require("../controller/vendorController");

const { authenticateVendor,
    authorizeVendor,
    vendorAuthorization } = require("../middleware/auth");
const { createCity } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginWithMobile)
router.post('/login-email', loginWithEmail)
router.post('/selectCity', authenticateVendor, selectCity)
router.post('/favourite/:vendorId', authenticateVendor, vendorAuthorization, addToFavourites);
router.put('/update-work-profile/:vendorId', authenticateVendor, vendorAuthorization, updateWorkProfile);
router.put('/update-documents/:vendorId', authenticateVendor, vendorAuthorization, updateDocuments);
router.put('/update/:vendorId/panCardImage', authenticateVendor, vendorAuthorization, updatePanCardImageImage);
router.put('/update/:vendorId/aadharCardImage', authenticateVendor, vendorAuthorization, updateAadharCardImage);
router.put('/update/:vendorId/otherDocumentImage', authenticateVendor, vendorAuthorization, updateOtherDocumentImage);
router.get('/cars', authenticateVendor, getAllCars);
router.get('/new-cars', authenticateVendor, getNewCars);
router.get('/used-cars', authenticateVendor, getUsedCars);
router.get('/search', authenticateVendor, searchCars);











//cityName
router.post('/cities', createCity)







router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;