const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true // Assuming guides are initially available
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String, // Assuming you store image URLs as strings
    required: true // Adjust as needed, it could be optional
  },
  // You can add more image properties if needed, such as alt text, etc.
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
