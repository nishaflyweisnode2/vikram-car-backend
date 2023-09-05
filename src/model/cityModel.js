const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },


}, { timestamps: true });

const City = mongoose.model('City', citySchema);

module.exports = City;
