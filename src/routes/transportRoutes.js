const express = require('express');
const router = express.Router();
const { createTransportService } = require('../controller/transportController');



router.post('/transport-services', createTransportService);


module.exports = router;
