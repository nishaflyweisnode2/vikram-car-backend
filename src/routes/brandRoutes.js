const express = require('express');
const router = express.Router();
const { createBrand, upload } = require('../controller/brandController');




router.post('/create', upload.single('image'), createBrand);





module.exports = router;
