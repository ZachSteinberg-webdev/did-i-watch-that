const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const User = require('./userModel.js');
const Show = require('./showModel.js');
const Season = require('./seasonModel.js');

const episodeSchema = new mongoose.Schema(
	{
		showObjectId: {
			type: objectId,
			ref: 'Show'
		},
		seasonObjectId: {
			type: objectId,
			ref: 'Season'
		},
		seasonNumber: {
			type: Number
		},
		episodeNumber: {
			type: Number
		},
		episodeId: {
			type: Number
		},
		episodeTitle: {
			type: String
		},
		episodeType: {
			type: String
		},
		episodeAirdate: {
			type: String
		},
		episodeAirtime: {
			type: String
		},
		episodeAirstamp: {
			type: Date
		},
		episodeRuntime: {
			type: Number
		},
		episodeRating: {
			type: Number
		},
		episodeSummaryHtml: {
			type: String
		},
		episodeImageLink: {
			type: String
		},
		showName: {
			type: String
		},
		usersWhoHaveWatched: [
			{
				type: objectId,
				ref: 'User'
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Episode', episodeSchema);
