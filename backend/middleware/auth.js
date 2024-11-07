const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const ErrorResponse = require('../utilities/errorResponse.js');

// Check if user is authenticated
exports.isAuthenticated = async(req, res, next)=>{
	const {token} = req.cookies;
	// Check if token exists
	if(!token){
		return next(new ErrorResponse(['Please log in to access this page.'], 401));
	};
	try{
		// Verify token
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decodedToken.id);
		next();
	}catch(err){
		return next(new ErrorResponse(['Please log in to access this page.'], 401))
	}
}
