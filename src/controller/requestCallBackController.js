const CallbackRequest = require('../model/requestCallBackModel');
const { callbackSchema } = require('../validation/requestCallBackValidaion');


const requestCallback = async (req, res) => {
    try {
        const { error } = callbackSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { name, phoneNumber, message } = req.body;

        const callbackRequest = new CallbackRequest({
            name,
            phoneNumber,
            message,
        });

        await callbackRequest.save();

        res.status(201).json({
            status: 201,
            message: 'Callback request sent successfully',
            callbackRequest,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send callback request' });
    }
};


const getAllCallbacks = async (req, res) => {
    try {
        const callbackRequests = await CallbackRequest.find();

        res.status(200).json({
            status: 200,
            message: 'Successfully retrieved callback requests',
            callbackRequests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve callback requests' });
    }
};


module.exports = {
    requestCallback,
    getAllCallbacks
};
