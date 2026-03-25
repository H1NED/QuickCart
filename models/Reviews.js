const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  name: String,
  rating: Number,
  text: String
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;