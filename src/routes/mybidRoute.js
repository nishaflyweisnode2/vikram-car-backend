const express = require('express');
const router = express.Router();
const myBidsController = require('../controller/myBidController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");

router.post('/mybids', authenticateUser, myBidsController.createMyBids);
router.get('/mybids/:myBidsId', authenticateUser, myBidsController.getMyBidsById);
router.put('/mybids/:myBidsId', authenticateUser, myBidsController.updateMyBidsById);
router.delete('/mybids/:myBidsId', authenticateUser, myBidsController.deleteMyBidsById);


module.exports = router;
