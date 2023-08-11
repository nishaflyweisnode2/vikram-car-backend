const express = require('express');
const router = express.Router();

const { createTermsAndConditions, getTermsAndConditions } = require('../controller/termAndConditionController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");



router.post('/createTermsAndConditions', authenticateUser, authenticateAdmin, createTermsAndConditions);
router.get('/getTermsAndConditions', authenticateUser, getTermsAndConditions);


module.exports = router;
