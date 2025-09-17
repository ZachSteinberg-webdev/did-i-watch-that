const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please input your name.'],
			maxlength: 32
		},
		email: {
			type: String,
			trim: true,
			required: [true, 'Please input your email address.'],
			unique: true,
			match: [
				/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
				'Your email address is invalid. Please verify you input it correctly.'
			]
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'Please input a password.'],
			minlength: [12, 'Your password must contain at least 12 characters.']
		},
		prefersDarkMode: {
			type: Boolean,
			default: true
		},
		role: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

// Hash password using bcryptjs
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 12);
});

// Verify password using bcryptjs
userSchema.methods.comparePassword = async function (providedPassword) {
	return await bcrypt.compare(providedPassword, this.password);
};

// Get token using jsonwebtoken
userSchema.methods.jwtGenerateToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
		expiresIn: 86400
	});
};

module.exports = mongoose.model('User', userSchema);
