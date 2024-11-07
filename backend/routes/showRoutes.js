const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
	getShows,
	addShow,
	deleteShow,
	sortShows,
	loadShow,
	toggleEpisodeWatched,
	toggleSeasonWatched,
	getShowDetails,
	getEpisodeDetails
} = require('../controllers/showControllers.js');

// Middleware
const {isAuthenticated} = require('../middleware/auth.js');

// Get all shows tracked by a given user route
router.get('/getShows', isAuthenticated, getShows);

// Add show to user's tracked shows list route
router.post('/addShow', isAuthenticated, addShow);

// Delete show from users's tracked shows list route
router.post('/deleteShow', isAuthenticated, deleteShow);

// Sort a user's shows list alphabetically
router.post('/sortShows', isAuthenticated, sortShows);

// Load show tracking for a specific show tracked by a given user route
router.post('/loadShow', isAuthenticated, loadShow);

// Toggle whether or not a given episode has been watched by a given user route
router.post('/toggleEpisodeWatched', isAuthenticated, toggleEpisodeWatched);

// Toggle whether or not all the episodes in a given season have been watched by a given user route
router.post('/toggleSeasonWatched', isAuthenticated, toggleSeasonWatched);

// Retrieve details for a given show
router.post('/getShowDetails', isAuthenticated, getShowDetails);

// Retrieve details for a given episode
router.post('/getEpisodeDetails', isAuthenticated, getEpisodeDetails);

module.exports = router;
