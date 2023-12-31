require('dotenv').config()
const express = require('express');
const router = express.Router();

const { signup, verifyOTP, resendOTP, login, selectCity, addToFavourites, removeFromFavorites, addToMyBid, getToMyBid, getMyWins, updateProfileImage, getFavoriteCars, getMyBids, getAllUsers, getUserById, startAutobid, resetAutobid, cancelAutobid } = require("../controller/userController");

const { authenticateUser, authorizeUser, authorization, authenticateAdmin, authenticateVendor } = require("../middleware/auth");

const { createCity, getAllCity, upload } = require('../controller/cityController');




// user
router.post('/signup', signup);
router.post('/verify-otp/:userId', verifyOTP);
router.post('/resend-otp/:userId', resendOTP);
router.post('/login', login)
router.post('/selectCity', authenticateUser, selectCity)
router.post('/favourite/:userId', authenticateUser, authorization, addToFavourites);
router.delete('/users/:userId/favorites/:carId', authenticateUser, removeFromFavorites);
router.post('/addToMyBids/:userId', authenticateUser, authorization, addToMyBid);
router.get('/addToMyBids/:userId', authenticateUser, authorization, getToMyBid);
router.get('/:userId/wins', authenticateUser, authorization, getMyWins);
router.put('/update/:userId/profileImage', authenticateUser, authorization, updateProfileImage);
router.get('/favorite-car/:userId', authenticateUser, authorization, getFavoriteCars);
router.get('/:userId/bids', authenticateUser, getMyBids);
router.get('/allUser', getAllUsers);
router.get('/:userId', getUserById);








//cityName
router.post('/cities', /*authenticateUser, authenticateAdmin,*/ authenticateVendor, upload.single('image'), createCity)
router.get('/cities/getAllCity', authenticateUser,  getAllCity);








router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;