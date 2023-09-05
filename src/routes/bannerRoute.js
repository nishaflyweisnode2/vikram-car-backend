const express = require('express');
const router = express.Router();

const { AddBanner, bannerUpload, getBanner, getBannerById, DeleteBanner } = require('../controller/bannerController');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");




router.post("/AddBanner", authenticateUser, bannerUpload.single('image'), AddBanner);
router.get("/Banner/allBanner", authenticateUser, getBanner);
router.get("/Banner/getBannerById/:id", authenticateUser, getBannerById);
router.delete("/Banner/deleteBanner/:id", authenticateUser, DeleteBanner);





module.exports = router;
