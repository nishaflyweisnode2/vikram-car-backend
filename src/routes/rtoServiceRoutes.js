const express = require('express');
const router = express.Router();
const { sendEnquiry } = require('../controller/rtoServiceController');



router.post('/rto/sendEnquiry',sendEnquiry);



module.exports = router;
