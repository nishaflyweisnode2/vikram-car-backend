const express = require('express');
const router = express.Router();
const { createSecurityDeposit, buySecurityDeposit, getSecurityDepositByUserId, getAllSecurityDeposits, getSecurityDepositById } = require('../controller/depositeController');

const { authenticateUser, authorizeUser, authenticateAdmin, authorization } = require('../middleware/auth');



router.post('/security-deposits/:userId', authenticateUser, authenticateAdmin, createSecurityDeposit);

router.post('/buy/:userId', authenticateUser, authorization, buySecurityDeposit);

router.get('/user/:userId', getSecurityDepositByUserId);

router.get('/security-deposits', getAllSecurityDeposits);

router.get('/:securityDepositId', getSecurityDepositById);


module.exports = router;
