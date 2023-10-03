require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, login, selectCity, addToFavourites, addToMyBid, getToMyBid, addMyBid, updateMyBid, getMyWins, updateProfileImage, getFavoriteCars, getMyBids, getAllUsers, getUserById, startAutobid, resetAutobid, cancelAutobid } = require("../controller/userController");

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");

const { createCity, getAllCity, upload } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp/:userId', verifyOTP);
router.post('/resend-otp/:userId', resendOTP);
router.post('/login', login)
router.post('/selectCity', authenticateUser, selectCity)
router.post('/favourite/:userId', authenticateUser, authorization, addToFavourites);
router.post('/addToMyBids/:userId', authenticateUser, authorization, addToMyBid);
router.get('/addToMyBids/:userId', authenticateUser, authorization, getToMyBid);
router.post('/users/:userId/bids', authenticateUser, authorization, addMyBid);
router.put('/auctions/:userId/updateBid', authenticateUser, updateMyBid);
router.get('/:userId/wins', authenticateUser, authorization, getMyWins);
router.put('/update/:userId/profileImage', authenticateUser, authorization, updateProfileImage);
router.get('/favorite-car/:userId', authenticateUser, authorization, getFavoriteCars);
router.get('/:userId/bids', authenticateUser, getMyBids);
router.get('/allUser', getAllUsers);
router.get('/:userId', getUserById);
router.post('/autobid/start/:auctionId', authenticateUser, startAutobid);
router.post('/autobid/reset/:auctionId', authenticateUser, resetAutobid);
router.post('/autobid/cancel/:auctionId', authenticateUser, cancelAutobid);








//cityName
router.post('/cities', authenticateUser, authenticateAdmin, upload.single('image'), createCity)
router.get('/cities/getAllCity', authenticateUser, getAllCity);








router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;