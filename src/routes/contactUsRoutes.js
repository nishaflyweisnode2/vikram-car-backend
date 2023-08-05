const express = require('express');
const router = express.Router();

const { sendContactMessage } = require('../controller/contactUsController');



router.post('/send', sendContactMessage);



module.exports = router;
