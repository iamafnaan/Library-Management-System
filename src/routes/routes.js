const express = require('express');
const userController = require('../control/userController');
const bookController = require('../control/bookController');
const { protect, restrictTo } = require('../middleware/authMiddleWare');

const router = express.Router();

// User Routes
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
router.put('/users/update/:id', protect, userController.updateUser);
router.delete('/users/delete/:id', protect, userController.deleteUser);
router.get('/users/session/validate', protect, userController.validateSession);

// Book Routes
router.post('/books/create', protect, restrictTo('author'), bookController.createBook);
router.get('/books', bookController.getAllBooks);
router.get('/books/author/:id', protect, restrictTo('author'), bookController.getAuthorBooks);
router.put('/books/update/:id', protect, restrictTo('author'), bookController.updateBook);
router.delete('/books/delete/:id', protect, restrictTo('author'), bookController.deleteBook);

// Reader Routes
router.post('/reader/books/borrow/:bookId', protect, restrictTo('reader'), bookController.borrowBook);
router.post('/reader/books/return/:bookId', protect, restrictTo('reader'), bookController.returnBook);
router.get('/reader/books/:id', protect, restrictTo('reader'), bookController.getUserBorrowedBooks);

module.exports = router;