const mongoose = require('mongoose');

// Define the Flight schema
const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  }
});

// Define the Flight model
const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
