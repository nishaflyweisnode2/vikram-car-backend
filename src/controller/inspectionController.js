const Inspection = require('../model/inspectionModel');
const Auction = require('../model/auctionModel');
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');


const createInspection = async (req, res) => {
    try {
        const { auction, car, requestedBy, inspectionDate, inspectionType, notes } = req.body;

        const checkCarId = await Car.findById(car);
        if (!checkCarId) {
            return res.status(404).json({ status: 404, message: 'Car with the given carId not found' });
        }

        const auctionData = await Auction.findById(auction);

        if (!auctionData) {
            return res.status(404).json({ status: 404, message: 'Auction not found with this Id' });
        }

        const checkUserId = await userDb.findById(requestedBy);
        if (!checkUserId) {
            return res.status(404).json({ status: 404, message: 'user with the given userId not found' });
        }

        const inspection = new Inspection({
            auction,
            car,
            requestedBy,
            inspectionDate,
            inspectionType,
            notes,
        });

        await inspection.save();

        res.status(201).json({ status: 201, message: 'Inspection request created successfully', inspection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create inspection request' });
    }
};


const getAllInspections = async (req, res) => {
    try {
        const inspections = await Inspection.find();

        res.status(200).json({ status: 200, data: inspections });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch inspections' });
    }
};


const getInspectionById = async (req, res) => {
    try {
        const inspectionId = req.params.inspectionId;
        const inspection = await Inspection.findById(inspectionId);

        if (!inspection) {
            return res.status(404).json({ status: 404, message: 'Inspection not found' });
        }

        res.status(200).json({ status: 200, data: inspection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch inspection' });
    }
};


const updateInspection = async (req, res) => {
    try {
        const inspectionId = req.params.inspectionId;
        const updateData = req.body;
        const updatedInspection = await Inspection.findByIdAndUpdate(inspectionId, updateData, { new: true });

        if (!updatedInspection) {
            return res.status(404).json({ status: 404, message: 'Inspection not found' });
        }

        res.status(200).json({ status: 200, message: 'Inspection updated successfully', inspection: updatedInspection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update inspection' });
    }
};


const deleteInspection = async (req, res) => {
    try {
        const inspectionId = req.params.inspectionId;
        const deletedInspection = await Inspection.findByIdAndRemove(inspectionId);

        if (!deletedInspection) {
            return res.status(404).json({ status: 404, message: 'Inspection not found' });
        }

        res.status(200).json({ status: 200, message: 'Inspection deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete inspection' });
    }
};

module.exports = {
    createInspection,
    getAllInspections,
    getInspectionById,
    updateInspection,
    deleteInspection,
};
