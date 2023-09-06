const express = require('express');
const router = express.Router();

const { sendQuote, getQuotes } = require('../controller/quotesController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/send', authenticateUser, sendQuote);
router.get('/allQuotes', authenticateUser, getQuotes);


module.exports = router;
