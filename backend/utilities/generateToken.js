const generateToken = async (user, statusCode, res) => {
	try {
		const token = await user.jwtGenerateToken();
		const options = {
			httpOnly: true,
			sameSite: 'Strict'
		};
		res.status(statusCode).cookie('token', token, options).json({ success: true, token, user });
	} catch (err) {
		console.log('Error in backend generateToken middleware', err);
	}
};

module.exports = generateToken;
