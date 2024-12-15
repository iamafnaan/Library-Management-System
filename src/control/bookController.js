const Book = require('../models/book');
const User = require('../models/user');

exports.createBook = async (req, res) => {
  try {
    const { title, genre, stock } = req.body;

    const newBook = await Book.create({
      title,
      genre,
      stock,
      author: req.user._id
    });

    // Add book to author's writtenBooks
    await User.findByIdAndUpdate(req.user._id, {
      $push: { writtenBooks: newBook._id }
    });

    res.status(201).json({
      status: 'success',
      data: { book: newBook }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    const searchParams = { title, genre, 'author.name': author };
    const queryObj = Object.keys(searchParams)
    .filter(key => searchParams[key])
    .reduce((acc, key) => {
        acc[key] = { $regex: searchParams[key], $options: 'i' };
        return acc;
    }, {});

    const books = await Book.find(queryObj);

    res.status(200).json({
      status: 'success',
      results: books.length,
      data: { books }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getAuthorBooks = async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.id });
    const borrowedBooks = await Book.find({ 
      'borrowedBy': { $exists: true, $ne: null } 
    });

    res.status(200).json({
      status: 'success',
      data: { 
        books,
        borrowedBooks
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, genre, stock } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'No book found with that ID'
      });
    }

    // Ensure only the author can update
    if (book.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this book'
      });
    }

    // Update fields
    if (title) book.title = title;
    if (genre) book.genre = genre;
    if (stock !== undefined) book.stock = stock;

    await book.save();

    res.status(200).json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'No book found with that ID'
      });
    }

    // Ensure only the author can delete
    if (book.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to delete this book'
      });
    }

    await Book.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { writtenBooks: req.params.id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.borrowBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.bookId);
      const user = await User.findById(req.user._id);
  
      // Check book exists
      if (!book) {
        return res.status(404).json({
          status: 'fail',
          message: 'Book not found'
        });
      }
  
      // Check book is in stock
      if (book.stock <= 0) {
        return res.status(400).json({
          status: 'fail',
          message: 'Book is currently out of stock'
        });
      }
  
      // Check user hasn't already borrowed maximum books
      if (user.borrowedBooks.length >= 5) {
        return res.status(400).json({
          status: 'fail',
          message: 'You have reached the maximum number of borrowed books (5)'
        });
      }
  
      // Check if user has already borrowed this book
      const alreadyBorrowed = user.borrowedBooks.includes(book._id);
      if (alreadyBorrowed) {
        return res.status(400).json({
          status: 'fail',
          message: 'You have already borrowed this book'
        });
      }
  
      // Update book stock
      book.stock -= 1;
      await book.save();
  
      // Add book to user's borrowed books
      user.borrowedBooks.push(book._id);
      await user.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Book borrowed successfully',
        data: { 
          book, 
          borrowedBooks: user.borrowedBooks 
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };
  
  exports.returnBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.bookId);
      const user = await User.findById(req.user._id);
  
      // Check book exists
      if (!book) {
        return res.status(404).json({
          status: 'fail',
          message: 'Book not found'
        });
      }
  
      // Check if user has borrowed this book
      const bookIndex = user.borrowedBooks.indexOf(book._id);
      if (bookIndex === -1) {
        return res.status(400).json({
          status: 'fail',
          message: 'You did not borrow this book'
        });
      }
  
      // Remove book from user's borrowed books
      user.borrowedBooks.splice(bookIndex, 1);
      await user.save();
  
      // Increase book stock
      book.stock += 1;
      await book.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Book returned successfully',
        data: { 
          book, 
          borrowedBooks: user.borrowedBooks 
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };
  
  exports.getUserBorrowedBooks = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('borrowedBooks');
  
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        results: user.borrowedBooks.length,
        data: { 
          borrowedBooks: user.borrowedBooks 
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };