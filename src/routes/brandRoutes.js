const express = require('express');
const router = express.Router();

const { createBrand, upload, getAllBrands } = require('../controller/brandController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");




router.post('/create', upload.single('image'), authenticateUser, authenticateAdmin, createBrand);
router.get('/brands', authenticateUser, getAllBrands);






module.exports = router;
