require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, login, selectCity, addToFavourites, addMyBid, getMyWins, updateProfileImage } = require("../controller/userController");
const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");
const { createCity } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp/:userId', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login)
router.post('/selectCity', authenticateUser, selectCity)
router.post('/favourite/:userId', authenticateUser, authorization, addToFavourites);
router.post('/users/:userId/bids', authenticateUser, authorization, addMyBid);
router.get('/:userId/wins', authenticateUser, authorization, getMyWins);
router.put('/update/:userId/profileImage', authenticateUser, authorization, updateProfileImage);




//cityName
router.post('/cities', authenticateUser, authenticateAdmin, createCity)







router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;