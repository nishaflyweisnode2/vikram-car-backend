const TransportServices = require('../model/transportModel');



const createTransportService = async (req, res) => {
    try {
        const {
            serviceType,
            fromLocation,
            toLocation,
            vehicleType,
            vehicleNumber,
            contactNumber,
            email,
            vehicleCondition,
            vehicleWheelCondition,
            additionalDetails,
        } = req.body;

        const transportService = new TransportServices({
            serviceType,
            fromLocation,
            toLocation,
            vehicleType,
            vehicleNumber,
            contactNumber,
            email,
            vehicleCondition,
            vehicleWheelCondition,
            additionalDetails,
        });
        await transportService.save();

        res.status(201).json({
            status: 201,
            message: 'Transport service created successfully',
            transportService,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create transport service' });
    }
};




module.exports = {
    createTransportService,
};
