require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, login, selectCity, addToFavourites, addMyBid, getMyWins } = require("../controller/userController");
const { createCity } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login)
router.post('/selectCity', selectCity)
router.post('/favourite/:userId', addToFavourites);
router.post('/users/:userId/bids', addMyBid);
router.get('/:userId/wins', getMyWins);




//cityName
router.post('/cities', createCity)







router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;