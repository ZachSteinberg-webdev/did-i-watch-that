const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
	sayHello,
	register,
	login,
	logout,
	singleUser,
	getUser,
	updateUser,
	updatePassword,
	toggleDarkMode
} = require('../controllers/userControllers.js');

// Middleware
const {isAuthenticated} = require('../middleware/auth.js');

// Test that API is up and running
router.get('/sayHello', sayHello); // Exposed at /api/sayHello

// Register user
router.post('/register', register);

// Log in user
router.post('/login', login);

// Log out user
router.get('/logout', logout);

// Find single user
router.get('/user/:id', singleUser);

// Get user profile
router.get('/getUser', isAuthenticated, getUser);

// Update user profile
router.post('/updateUser', isAuthenticated, updateUser);

// Update user password
router.post('/updatePassword', isAuthenticated, updatePassword);

// Toggle user dark mode setting
router.post('/toggleDarkMode', isAuthenticated, toggleDarkMode);

module.exports = router;
