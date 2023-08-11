const express = require('express');
const router = express.Router();

const { sendContactMessage } = require('../controller/contactUsController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/send', authenticateUser, sendContactMessage);



module.exports = router;
