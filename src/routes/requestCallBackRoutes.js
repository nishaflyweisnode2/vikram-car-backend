const express = require('express');
const router = express.Router();

const { requestCallback, getAllCallbacks } = require('../controller/requestCallBackController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/send-request', authenticateUser, requestCallback);

router.get('/all-callbacks', authenticateUser, getAllCallbacks);





module.exports = router;
