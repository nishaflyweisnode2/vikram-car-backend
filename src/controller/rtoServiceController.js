const RTO = require('../model/rtoServiceModel');
const { sendEnquirySchema } = require('../validation/rtoServiceValidation');



const sendEnquiry = async (req, res) => {
    try {
        const { error } = sendEnquirySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const {
            iWant,
            fromState,
            toState,
            vehicleNumber,
            mobileNumber,
            email,
            ownedBy,
            vehicleClass,
            additionalQuestions,
        } = req.body;

        const rto = new RTO({
            iWant,
            fromState,
            toState,
            vehicleNumber,
            mobileNumber,
            email,
            ownedBy,
            vehicleClass,
            additionalQuestions,
        });
        await rto.save();

        res.status(201).json({
            status: 201,
            message: 'RTO entry created successfully',
            rto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create RTO entry' });
    }
};





module.exports = { sendEnquiry };
