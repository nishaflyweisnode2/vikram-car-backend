const Quote = require('../model/quotesModel');
const User = require('../model/userModel');
const Car = require('../model/carModel');
const Joi = require('joi');


// Validation schema for sending a quote
const sendQuoteSchema = Joi.object({
    userId: Joi.string().required(),
    carDetails: Joi.string().required(),
    quoteAmount: Joi.string().required(),
});


const sendQuote = async (req, res) => {
    try {
        const { error } = sendQuoteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const { userId, carDetails, quoteAmount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const car = await Car.findById(carDetails);
        if (!car) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
        }

        const quote = new Quote({
            userId,
            carDetails,
            quoteAmount,
        });

        await quote.save();

        res.status(200).json({ status: 200, message: 'Thank you for interest Our executive will get in touch with you shortly', data: quote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send quote' });
    }
};



const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().populate('userId', 'fullName email mobileNumber');
        res.status(200).json({ status: 200, data: quotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
};



module.exports = { sendQuote, getQuotes };
