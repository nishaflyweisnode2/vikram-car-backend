const City = require('../model/cityModel');

const createCity = async (req, res) => {
    const { cityName } = req.body;
    try {
        const existingCity = await City.findOne({ cityName });
        if (existingCity) {
            return res.status(400).json({ status: 400, message: 'City already exists', city: existingCity });
        }
        const city = new City({ cityName });
        await city.save();

        res.status(201).json({ status: 201, message: 'City created successfully', city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create city' });
    }
};


const getAllCity = async (req, res) => {
    try {
        const cities = await City.find();
        if (!cities || cities.length === 0) {
            return res.status(404).json({ status: 404, message: "No cities found" });
        }

        return res.status(200).json({ status: 200, data: cities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch cities' });
    }
};


module.exports = { createCity, getAllCity };
