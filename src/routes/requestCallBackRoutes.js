const express = require('express');
const router = express.Router();

const { requestCallback } = require('../controller/requestCallBackController');



router.post('/send-request', requestCallback);




module.exports = router;
