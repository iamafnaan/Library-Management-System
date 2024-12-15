# Library Management System Backend

## Overview
This is a comprehensive backend system for a Library Management System built with Express.js, MongoDB, and Mongoose.

## Features
- User authentication (Reader and Author roles)
- Book management 
- Book borrowing and returning
- Session management

## Prerequisites
- Node.js (v14+)
- MongoDB
- npm

## Installation

1. Clone the repository
```bash
git clone https://github.com/iamafnaan/Library-Management-System.git
cd Library-Management-System

```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15d
JWT_COOKIE_EXPIRES_IN=15
```

4. Start the server
```bash
npm start
```

## API Endpoints

### User Endpoints
- `POST /users/signup`: Register new user
- `POST /users/login`: User login
- `PUT /users/update/:id`: Update user details
- `DELETE /users/delete/:id`: Delete user account
- `GET /users/session/validate`: Validate user session

### Book Endpoints
- `POST /books/create`: Create a new book (Authors only)
- `GET /books`: Retrieve all books
- `GET /books/author/:id`: Get books by a specific author
- `PUT /books/update/:id`: Update book details (Authors only)
- `DELETE /books/delete/:id`: Delete a book (Authors only)

### Reader Endpoints
- `POST /reader/books/borrow/:bookId`: Borrow a book
- `POST /reader/books/return/:bookId`: Return a book
- `GET /reader/books/:id`: Get user's borrowed books

## Authentication
- Uses JWT for authentication
- Tokens are valid for 15 days
- Protected routes require a valid token

## Testing
-It was done via Postman
-I have attached the testing link done on postman
-Download that json file and open in your postman desktop app
-check the comprehensive tests done 
-link :https://drive.google.com/file/d/1Ql5QldDb3RR2frAu6LXR84kIIXXFKbhA/view?usp=sharing