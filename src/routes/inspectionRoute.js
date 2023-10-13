const express = require('express');
const router = express.Router();
const inspectionController = require('../controller/inspectionController');
const { validateCreateInspection } = require('../validation/inspectionValidation');

const { authenticateUser, authorizeUser, authorization, authenticateAdmin } = require("../middleware/auth");


router.post('/inspections', authenticateUser, validateCreateInspection, (req, res) => {
    inspectionController.createInspection(req, res);
});
router.get('/inspections', authenticateUser, (req, res) => {
    inspectionController.getAllInspections(req, res);
});
router.get('/inspections/:inspectionId', authenticateUser, (req, res) => {
    inspectionController.getInspectionById(req, res);
});
router.put('/inspections/:inspectionId', authenticateUser, (req, res) => {
    inspectionController.updateInspection(req, res);
});
router.delete('/inspections/:inspectionId', authenticateUser, (req, res) => {
    inspectionController.deleteInspection(req, res);
});

module.exports = router;
