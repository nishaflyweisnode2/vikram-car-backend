const City = require('../model/cityModel');

const createCity = async (req, res) => {
    const { cityName } = req.body;
    try {
        const city = new City({ cityName });
        await city.save();

        res.status(201).json({ status: 201, message: 'City created successfully', city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create city' });
    }
};

module.exports = { createCity };
