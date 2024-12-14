const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must have a title'],
    trim: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A book must have an author']
  },
  genre: {
    type: String,
    required: [true, 'A book must have a genre']
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate author details when querying
bookSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email'
  });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;