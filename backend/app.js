if(process.env.NODE_ENV!=="production") {
	const dotenv=require('dotenv').config();
};
const express = require('express');
const path=require('path');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error.js');
const hmsTime = require('./utilities/hmsTime');

// Routes
const userRoutes = require('./routes/userRoutes.js');
const showRoutes = require('./routes/showRoutes.js');

// Morgan logging middleware
app.use(morgan('dev'));

// Mongo sanitize middlware
app.use(mongoSanitize());

// Helmet middleware
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				"script-src": ["'self'", "'unsafe-inline'", "api.tvmaze.com"],
				"default-src": ["'self'", "api.tvmaze.com"],
				"img-src": ["'self'", "static.tvmaze.com"]
			},
		},
	}),
);

// app.use(helmet({
// 	contentSecurityPolicy: {
// 		directives: {
// 			"script-src": ["'self'", "'unsafe-inline'", "api.tvmaze.com"],
// 			"default-src": ["'self'", "api.tvmaze.com"]
// 		},
// 	},
// 	referrerPolicy: {
// 		policy: "same-origin"
// 	},
// }),);

// Body Parser middleware
app.use(bodyParser.json());

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors());

// Route middleware
app.use('/api', userRoutes);
app.use('/api', showRoutes);

// Error handler middleware
app.use(errorHandler);


app.use(express.static(path.join('/app/frontend/dist')));

app.get('*', function(req, res){
	res.sendFile(path.join('/app/frontend/dist/index.html'));
});

// Mongo database connection
mongoose.connect(process.env.REMOTE_DATABASE)
	.then(()=>{console.log(`${hmsTime()}: Mongo connection open.`)})
	.catch(error=>{console.log(`${hmsTime()}: Mongo error: ${error}`)});

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
	console.log(`Express app is running on port ${port}`);
});
