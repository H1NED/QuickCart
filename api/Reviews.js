const express = require('express');
const Review = require('./../models/Reviews');

const router = express.Router();

// GET-запрос для получения отзывов
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST-запрос для добавления отзыва
router.post('/', async (req, res) => {
  try {
    const { name, rating, text } = req.body;
    const review = new Review({ name, rating, text });
    await review.save();
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE-запрос для удаления отзыва
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;