const express = require('express');
const router = express.Router();
const { createSecurityDeposit, buySecurityDeposit } = require('../controller/depositeController');

const { authenticateUser, authorizeUser } = require('../middleware/auth');



router.post('/security-deposits/:userId', createSecurityDeposit);

router.post('/buy/:userId', buySecurityDeposit);



module.exports = router;
