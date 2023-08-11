const express = require('express');
const router = express.Router();

const { createSubscription, buySubscription, getAllSubscriptions } = require('../controller/subscriptionController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/createSubscription', authenticateUser, authenticateAdmin, createSubscription);
router.post('/buy', authenticateUser, buySubscription);
router.get('/all', authenticateUser, getAllSubscriptions);


module.exports = router;
