const express = require('express');
const router = express.Router();
const { createSubscription, buySubscription, getAllSubscriptions } = require('../controller/subscriptionController');



router.post('/createSubscription', createSubscription);
router.post('/buy', buySubscription);
router.get('/all', getAllSubscriptions);


module.exports = router;
