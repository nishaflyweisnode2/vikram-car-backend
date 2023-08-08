require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, loginWithMobile, loginWithEmail, selectCity, addToFavourites, updateWorkProfile, updateDocuments } = require("../controller/vendorController");
const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");
const { createCity } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginWithMobile)
router.post('/login-email', loginWithEmail)
router.post('/selectCity', authenticateUser, selectCity)
router.post('/favourite/:userId', authenticateUser, authorization, addToFavourites);
router.put('/update-work-profile/:vendorId', updateWorkProfile);
router.put('/update-documents/:vendorId', updateDocuments);






//cityName
router.post('/cities', createCity)







router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;