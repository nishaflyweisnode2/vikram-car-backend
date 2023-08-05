const express = require('express');
const router = express.Router();
const { createTermsAndConditions, getTermsAndConditions } = require('../controller/termAndConditionController');



router.post('/createTermsAndConditions', createTermsAndConditions);
router.get('/getTermsAndConditions', getTermsAndConditions);


module.exports = router;
