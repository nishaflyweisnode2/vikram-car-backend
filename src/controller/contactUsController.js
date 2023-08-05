const { contactUsSchema } = require('../validation/contactUsValidation');
const ContactUs = require('../model/contactUsModel');



const sendContactMessage = async (req, res) => {
    try {
        const { error } = contactUsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { name, email, mobileNumber, message } = req.body;

        const contactMessage = new ContactUs({
            name,
            email,
            mobileNumber,
            message,
        });

        await contactMessage.save();

        res.status(201).json({
            status: 201,
            message: 'Contact message sent successfully',
            contactMessage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send contact message' });
    }
};



module.exports = {
    sendContactMessage,
};
