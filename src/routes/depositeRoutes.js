const express = require('express');
const router = express.Router();
const { createSecurityDeposit, buySecurityDeposit } = require('../controller/depositeController');

const { authenticateUser, authorizeUser, authenticateAdmin, authorization } = require('../middleware/auth');



router.post('/security-deposits/:userId', authenticateUser, authenticateAdmin, createSecurityDeposit);

router.post('/buy/:userId', authenticateUser, authorization, buySecurityDeposit);



module.exports = router;
