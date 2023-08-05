const TermsAndConditions = require('../model/termAndConditionModel');
const { createTermsAndConditionsSchema } = require('../validation/termAndConditionValidation');



const createTermsAndConditions = async (req, res) => {
    try {
        const { error } = createTermsAndConditionsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { content } = req.body;

        const termsAndConditions = new TermsAndConditions({ content });
        await termsAndConditions.save();

        res.status(201).json({
            status: 201,
            message: 'Terms and Conditions created successfully',
            termsAndConditions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create Terms and Conditions' });
    }
};



const getTermsAndConditions = async (req, res) => {
    try {
        const termsAndConditions = await TermsAndConditions.findOne().sort({ createdAt: -1 });

        res.status(200).json({ status: 200, termsAndConditions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get Terms and Conditions' });
    }
};



module.exports = {
    createTermsAndConditions,
    getTermsAndConditions,
};

