const express = require('express');
const router = express.Router();

const { sendEnquiry } = require('../controller/rtoServiceController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/rto/sendEnquiry', authenticateUser, sendEnquiry);



module.exports = router;
