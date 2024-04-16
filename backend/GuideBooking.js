// GuideBooking.js

const mongoose = require('mongoose');

const guideBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  destination: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  // You can add more fields as needed
});

const GuideBooking = mongoose.model('GuideBooking', guideBookingSchema);

module.exports = GuideBooking;
