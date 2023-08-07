const express = require('express');
const router = express.Router();

const { requestCallback, getAllCallbacks } = require('../controller/requestCallBackController');



router.post('/send-request', requestCallback);

router.get('/all-callbacks', getAllCallbacks);





module.exports = router;
