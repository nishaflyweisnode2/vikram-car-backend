const express = require('express');
const router = express.Router();

const { createTransportService } = require('../controller/transportController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/transport-services', authenticateUser, createTransportService);


module.exports = router;
