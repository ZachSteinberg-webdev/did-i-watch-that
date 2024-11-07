const axios = require('axios');
const sanitizeHtml = require('sanitize-html')
const User = require('../models/userModel.js');
const ShowsList = require('../models/showsListModel.js');
const Show = require('../models/showModel.js');
const Season = require('../models/seasonModel.js');
const Episode = require('../models/episodeModel.js');
const ErrorResponse = require('../utilities/errorResponse.js');

// Get all tracked shows of a given user
exports.getShows = async(req, res, next)=>{
	try{
		const user = await User.findById(req.user.id);
		const showsList = await ShowsList.find({showsListOwner: user._id}).populate('shows');
		res.status(200).json({
			success: true,
			showsList
		});
	}catch(err){
		console.log('Error from getShows route backend: ', err);
	};
};

// Add a show to a user's tracked shows list
exports.addShow = async(req, res, next)=>{
	try{
		// Store necessary data as variables
		const userId = req.body.user._id;
		const postedShowData = req.body.postedShowDataObject;
		const newShow = {};
		// Pull up user's list of tracked shows
		let userShowsList = await ShowsList.findOne({showsListOwner: userId});
		// If user is new and doesn't yet have a tracked list created, create one
		if(!userShowsList){
			userShowsList = await new ShowsList({showsListOwner: userId, shows:[]});
			await userShowsList.save();
		};
		// Check if show already exists in Shows collection
		const existingShow = await Show.findOne({showId: postedShowData.id});
		let existingShowObjectId = undefined;
		// If show already exists, get its ObjectId
		if(existingShow){
			existingShowObjectId = existingShow._id;
		};
		// Get list of shows tracked by user already
		const listOfShowsTrackedByUser = userShowsList.shows;
		// Check if user is already tracking show. If they are, let them know.
		if(existingShowObjectId && listOfShowsTrackedByUser.includes(existingShowObjectId)){
			return res.status(200).json({success: false, error: ['You are already tracking that show!']});
		// If show exists in Shows collection but isn't being tracked by user, check if show needs to be updated, updated show if necessary, then add show to their tracked shows list
		}else if(existingShowObjectId && !listOfShowsTrackedByUser.includes(existingShowObjectId)){
			const showLastUpdatedInDatabaseEpoch = Math.floor(Date.parse(existingShow.updatedAt)/1000);
			const showLastUpdatedByApiEpoch = postedShowData.updated;
			if(showLastUpdatedByApiEpoch>showLastUpdatedInDatabaseEpoch){
				existingShow.showName=postedShowData.name;
				existingShow.showPremiereDate=postedShowData.premiered;
				existingShow.showEndedDate=postedShowData.ended;
				existingShow.showAverageRuntime=postedShowData.averageRuntime;
				existingShow.showRuntime=postedShowData.runtime;
				existingShow.showImdbId=postedShowData.externals.imdb;
				existingShow.showTheTvdbNumber=postedShowData.externals.thetvdb;
				existingShow.showGenres=postedShowData.genres;
				existingShow.showImageLink=postedShowData.image && postedShowData.image.original;
				existingShow.showLanguage=postedShowData.language;
				existingShow.showNetwork=postedShowData.network && postedShowData.network.name;
				existingShow.showNetworkWebsiteLink=postedShowData.network && postedShowData.network.officialSite;
				existingShow.showCountry=postedShowData.network && postedShowData.network.country.name;
				existingShow.showWebsiteLink=postedShowData.officialSite;
				existingShow.showAverageRating=postedShowData.rating.average;
				existingShow.showAirDays=postedShowData.schedule.days;
				existingShow.showAirTime=postedShowData.schedule.time;
				existingShow.showStatus=postedShowData.status;
				existingShow.showSummaryHtml=sanitizeHtml(postedShowData.summary, {allowedTags:['p'], allowedAttributes:{}});
				existingShow.showType=postedShowData.type;
				existingShow.showUpdatedEpoch=postedShowData.updated;
				existingShow.showWebChannelName=postedShowData.webChannel && postedShowData.webChannel.name;
				existingShow.showWebChannelWebsiteLink=postedShowData.webChannel && postedShowData.webChannel.officialSite;
				await existingShow.save();
				// Get show season data from tvmaze API
				const showSeasonsData = await axios.get(`https://api.tvmaze.com/shows/${existingShow.showId}/seasons`);
					const seasonsData = showSeasonsData.data;
				// Store necessary season data as variables
				const showObjectId = existingShow._id;
				// Loop over array of seasons, pull each season's pertinent data and update Season document for it
				for(let season of seasonsData){
					let seasonObjectId = '';
					const seasonNumber = season.number;
					const seasonId = season.id;
					const seasonName = season.name;
					const seasonEpisodeOrder = season.episodeOrder;
					const seasonPremiereDate = season.premiereDate;
					const seasonEndDate = season.endDate;
					const episodeObjectIds = [];
					const newSeasonData = {
						showObjectId,
						seasonNumber,
						seasonId,
						seasonName,
						seasonEpisodeOrder,
						seasonPremiereDate,
						seasonEndDate,
						episodeObjectIds
					};
					const seasonToUpdate = await Season.findOne({seasonId: seasonId});
					if(seasonToUpdate){
						seasonObjectId=seasonToUpdate._id;
						seasonToUpdate.seasonEpisodeOrder = newSeasonData.seasonEpisodeOrder;
						seasonToUpdate.seasonPremiereDate = newSeasonData.seasonPremiereDate;
						seasonToUpdate.seasonEndDate = newSeasonData.seasonEndDate;
						await seasonToUpdate.save();
					}else{
						const newSeasonAdded = await new Season(newSeasonData);
						await newSeasonAdded.save();
						const newSeason = await Season.findOne({seasonId: seasonId});
						seasonObjectId = newSeason._id;
						await existingShow.seasonObjectIds.push(seasonObjectId);
						await existingShow.save();
					};
					// Get episode data for the season
					const seasonEpisodesData = await axios.get(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
					const episodesData = seasonEpisodesData.data;
					for(let episode of episodesData){
						const episodeNumber = episode.number;
						const episodeId = episode.id;
						const episodeTitle = episode.name || undefined;
						const episodeType = episode.type;
						const episodeAirdate = episode.airdate;
						const episodeAirtime = episode.airtime;
						const episodeAirstamp = episode.airstamp;
						const episodeRuntime = episode.runtime;
						const episodeRating = episode.rating.average;
						const episodeSummaryHtml = sanitizeHtml(episode.summary, {allowedTags:['p'], allowedAttributes:{}});
						const episodeImageLink = episode.image && episode.image.original;
						const showName = episode._links.show.name;
						const usersWhoHaveWatched = [];
						const newEpisodeData = {
							showObjectId,
							seasonObjectId,
							seasonNumber,
							episodeNumber,
							episodeId,
							episodeTitle,
							episodeType,
							episodeAirdate,
							episodeAirtime,
							episodeAirstamp,
							episodeRuntime,
							episodeRating,
							episodeSummaryHtml,
							episodeImageLink,
							showName,
							usersWhoHaveWatched
						};
						const episodeToUpdate = await Episode.findOne({episodeId: episodeId});
						if(episodeToUpdate){
							episodeToUpdate.episodeTitle = newEpisodeData.episodeTitle;
							episodeToUpdate.episodeAirdate = newEpisodeData.episodeAirdate;
							episodeToUpdate.episodeAirtime = newEpisodeData.episodeAirtime;
							episodeToUpdate.episodeAirstamp = newEpisodeData.episodeAirstamp;
							episodeToUpdate.episodeRuntime = newEpisodeData.episodeRuntime;
							episodeToUpdate.episodeRating = newEpisodeData.episodeRating;
							episodeToUpdate.episodeSummaryHtml = newEpisodeData.episodeSummaryHtml;
							episodeToUpdate.episodeImageLink = newEpisodeData.episodeImageLink;
							await episodeToUpdate.save();
						}else{
							const newEpisodeAdded = await new Episode(newEpisodeData);
							await newEpisodeAdded.save();
							const newEpisode = await Episode.findOne({episodeId: episodeId});
							const newEpisodeObjectId = newEpisode._id;
							if(seasonToUpdate){
								seasonToUpdate.episodeObjectIds.push(newEpisodeObjectId);
								await seasonToUpdate.save();
							}else{
								const newSeason = await Season.findOne({seasonId: seasonId});
								await newSeason.episodeObjectIds.push(newEpisodeObjectId);
								await newSeason.save();
							};
						};
					};
				};
			};
			await listOfShowsTrackedByUser.unshift(existingShowObjectId);
		// If show doesn't exist in Shows collection, add show to Shows collection, add show's ObjectId to user's ShowsList, then pull in all pertinent data about show's seasons and episodes into show's Season and Episode collections
		}else{
			newShow.showId=postedShowData.id;
			newShow.showName=postedShowData.name;
			newShow.showPremiereDate=postedShowData.premiered;
			newShow.showEndedDate=postedShowData.ended;
			newShow.showAverageRuntime=postedShowData.averageRuntime;
			newShow.showRuntime=postedShowData.runtime;
			newShow.showImdbId=postedShowData.externals.imdb;
			newShow.showTheTvdbNumber=postedShowData.externals.thetvdb;
			newShow.showGenres=postedShowData.genres;
			newShow.showImageLink=postedShowData.image && postedShowData.image.original;
			newShow.showLanguage=postedShowData.language;
			newShow.showNetwork=postedShowData.network && postedShowData.network.name;
			newShow.showNetworkWebsiteLink=postedShowData.network && postedShowData.network.officialSite;
			newShow.showCountry=postedShowData.network && postedShowData.network.country.name;
			newShow.showWebsiteLink=postedShowData.officialSite;
			newShow.showAverageRating=postedShowData.rating.average;
			newShow.showAirDays=postedShowData.schedule.days;
			newShow.showAirTime=postedShowData.schedule.time;
			newShow.showStatus=postedShowData.status;
			newShow.showSummaryHtml=sanitizeHtml(postedShowData.summary, {allowedTags:['p'], allowedAttributes:{}});
			newShow.showType=postedShowData.type;
			newShow.showUpdatedEpoch=postedShowData.updated;
			newShow.showWebChannelName=postedShowData.webChannel && postedShowData.webChannel.name;
			newShow.showWebChannelWebsiteLink=postedShowData.webChannel && postedShowData.webChannel.officialSite;
			const newShowAdded = await new Show(newShow);
			await newShowAdded.save();
			await listOfShowsTrackedByUser.unshift(newShowAdded);
			// Pull up newly-added show from Show collection
			const show = await Show.findOne({showId: newShow.showId});
			// Get show season data from tvmaze API
			const showSeasonsData = await axios.get(`https://api.tvmaze.com/shows/${newShow.showId}/seasons`);
				const seasonsData = showSeasonsData.data;
			// Store necessary season data as variables
			const showObjectId = show._id;
			// Loop over array of seasons, pull each season's pertinent data and create a new Season document for it
			for(let season of seasonsData){
				const seasonNumber = season.number;
				const seasonId = season.id;
				const seasonName = season.name;
				const seasonEpisodeOrder = season.episodeOrder;
				const seasonPremiereDate = season.premiereDate;
				const seasonEndDate = season.endDate;
				const episodeObjectIds = [];
				const newSeasonData = {
					showObjectId,
					seasonNumber,
					seasonId,
					seasonName,
					seasonEpisodeOrder,
					seasonPremiereDate,
					seasonEndDate,
					episodeObjectIds
				};
				const newSeasonAdded = await new Season(newSeasonData);
				await newSeasonAdded.save();
				const newSeason = await Season.findOne({seasonId: seasonId});
				const seasonObjectId = newSeason._id;
				await show.seasonObjectIds.push(seasonObjectId);
				await show.save();
				// Get episode data for the season
				const seasonEpisodesData = await axios.get(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
				const episodesData = seasonEpisodesData.data;
				for(let episode of episodesData){
					const episodeNumber = episode.number;
					const episodeId = episode.id;
					const episodeTitle = episode.name || undefined;
					const episodeType = episode.type;
					const episodeAirdate = episode.airdate;
					const episodeAirtime = episode.airtime;
					const episodeAirstamp = episode.airstamp;
					const episodeRuntime = episode.runtime;
					const episodeRating = episode.rating.average;
					const episodeSummaryHtml = sanitizeHtml(episode.summary, {allowedTags:['p'], allowedAttributes:{}});
					const episodeImageLink = episode.image && episode.image.original;
					const showName = episode._links.show.name;
					const usersWhoHaveWatched = [];
					const newEpisodeData = {
						showObjectId,
						seasonObjectId,
						seasonNumber,
						episodeNumber,
						episodeId,
						episodeTitle,
						episodeType,
						episodeAirdate,
						episodeAirtime,
						episodeAirstamp,
						episodeRuntime,
						episodeRating,
						episodeSummaryHtml,
						episodeImageLink,
						showName,
						usersWhoHaveWatched
					};
					const newEpisodeAdded = await new Episode(newEpisodeData);
					await newEpisodeAdded.save();
					const newEpisode = await Episode.findOne({episodeId: episodeId});
					const newEpisodeObjectId = newEpisode._id;
					await newSeason.episodeObjectIds.push(newEpisodeObjectId);
					await newSeason.save();
				};
			};
		};
		// Save user's tracked shows list
		await userShowsList.save();
		// Generate new list of tracked shows (populated) to frontend
		const returnedListOfTrackedShows = await ShowsList.findOne({showsListOwner: userId}).populate('shows');
		// Store message to send to user in returnd JSON
		const message = [`"${newShow.showName||postedShowData.name}" has been added to your list of tracked shows!`];
		// Send new list of tracked shows (populated) to frontend
		return res.status(201).json({success: true, message: message, returnedListOfTrackedShows});
	}catch(err){
		console.log('Error from backend addShow route: ', err);
	};
};

// Delete a show from a user's list of tracked shows
exports.deleteShow = async(req, res, next)=>{
	try{
		// Store necessary data as variables
		const userId = req.body.user._id;
		const showObjectId = req.body.showObjectId;
		// Pull up show by ObjectId
		const show = await Show.findById(showObjectId);
		// Store showName for later use in returned JSON object
		const showName = show.showName;
		// Pull up user's list of tracked shows
		const userShowsList = await ShowsList.findOne({showsListOwner: userId});
		// Store array of show ObjectIds
		const listOfShowsTrackedByUser = userShowsList.shows;
		// If user has tracked shows list and tracked shows list contains specified show, remove show from list
		if(userShowsList && listOfShowsTrackedByUser.includes(showObjectId)){
			await userShowsList.shows.pull({_id: showObjectId});
			// Save user's updated tracked shows list
			await userShowsList.save();
			// Generate new list of user's tracked shows
			const returnedListOfTrackedShows = await ShowsList.findOne({showsListOwner: userId}).populate('shows');
			// Store message to be sent to frontend in JSON object
			const message = [`"${showName}" has been removed from your list of tracked shows!`];
			// Send new list of user's tracked show back to frontend
			return res.status(200).json({success: true, message: message, returnedListOfTrackedShows});
		}else{
			const message = ['Hmmm... That show was not found in your tracked shows list. Strange!'];
			return res.status(400).json({success: false, message: message});
		};
	}catch(err){
		console.log('Error from backend deleteShow route: ', err);
	};
};

// Sort a user's list of shows alphabetically by show name
exports.sortShows = async(req, res, next)=>{
	// Store necessary data as variables
	const userId = req.body.user._id;
	try{
		// Pull up list of user's tracked shows
		const showsList = await ShowsList.findOne({showsListOwner: userId});
		// Extract array of show objectIds
		const showsListShows = showsList.shows;
		// Pull up list of user's tracked shows (populated and sorted alphabetically by showName)
		const showsListPopulatedSorted = await ShowsList.findOne({showsListOwner: userId})
			.populate({path: 'shows', options: {sort: {'showName':1}}});
		// Extract populated array of Show Objects
		const showsListPopulatedSortedShows = showsListPopulatedSorted.shows;
		// Build array of just Show ObjectIds as strings
		const showsObjectIdArray = showsListPopulatedSortedShows.map((show)=>{
			return show['_id'];
		});
		// Create a JSON string out of each version of the user's shows list (old and new)
		const showsListShowsString = JSON.stringify(showsListShows);
		const showsObjectIdArrayString = JSON.stringify(showsObjectIdArray);
		// Compare old and new arrays
		if(showsListShowsString===showsObjectIdArrayString){
		// If both arrays are equal, let user know and return list of tracked shows
			const message=['Your shows are already in alphabetical order!'];
			return res.status(200).json({success: false, error: message});
		}else{
			// Set "shows" ObjectId array equal to the sorted array of ObjectId strings
			showsListPopulatedSorted.shows=showsObjectIdArray;
			// Save updated ShowsList document
			await showsListPopulatedSorted.save();
			// Store message to send to frontend in JSON object
			const message = ['Your shows have been sorted alphabetically.'];
			// Generate new, sorted list of user's tracked shows
			const returnedListOfTrackedShows = await ShowsList.findOne({showsListOwner: userId}).populate('shows');
			// Send new, sorted list of user's tracked shows to frontend
			return res.status(200).json({success: true, message: message, returnedListOfTrackedShows});
		};
	}catch(err){
		console.log('Error from backend sortShows route: ', err);
	};
};

// Load show tracking for a specific show tracked by a given user
exports.loadShow = async(req, res, next)=>{
	const userId = req.body.user._id;
	const showObjectId = req.body.showObjectId;
	try{
		// Pull up existing show from Show collection
		const show = await Show.findById(showObjectId);
		const showLastUpdatedInDatabaseEpoch = Math.floor(Date.parse(show.updatedAt)/1000);
		const data = await axios.get(`https://api.tvmaze.com/shows/${show.showId}`);
		const showData = data.data;
		const showLastUpdatedByApiEpoch = showData.updated;
		if(showLastUpdatedByApiEpoch>showLastUpdatedInDatabaseEpoch){
			show.showName=showData.name;
			show.showPremiereDate=showData.premiered;
			show.showEndedDate=showData.ended;
			show.showAverageRuntime=showData.averageRuntime;
			show.showRuntime=showData.runtime;
			show.showImdbId=showData.externals.imdb;
			show.showTheTvdbNumber=showData.externals.thetvdb;
			show.showGenres=showData.genres;
			show.showImageLink=showData.image && showData.image.original;
			show.showLanguage=showData.language;
			show.showNetwork=showData.network && showData.network.name;
			show.showNetworkWebsiteLink=showData.network && showData.network.officialSite;
			show.showCountry=showData.network && showData.network.country.name;
			show.showWebsiteLink=showData.officialSite;
			show.showAverageRating=showData.rating.average;
			show.showAirDays=showData.schedule.days;
			show.showAirTime=showData.schedule.time;
			show.showStatus=showData.status;
			show.showSummaryHtml=sanitizeHtml(showData.summary, {allowedTags:['p'], allowedAttributes:{}});
			show.showType=showData.type;
			show.showUpdatedEpoch=showData.updated;
			show.showWebChannelName=showData.webChannel && showData.webChannel.name;
			show.showWebChannelWebsiteLink=showData.webChannel && showData.webChannel.officialSite;
			await show.save();
			// Get show season data from tvmaze API
			const showSeasonsData = await axios.get(`https://api.tvmaze.com/shows/${show.showId}/seasons`);
			const seasonsData = showSeasonsData.data;
			// Store necessary season data as variables
			const showObjectId = show._id;
			// Loop over array of seasons, pull each season's pertinent data and update Season document for it
			for(let season of seasonsData){
				let seasonObjectId = '';
				const seasonNumber = season.number;
				const seasonId = season.id;
				const seasonName = season.name;
				const seasonEpisodeOrder = season.episodeOrder;
				const seasonPremiereDate = season.premiereDate;
				const seasonEndDate = season.endDate;
				const episodeObjectIds = [];
				const newSeasonData = {
					showObjectId,
					seasonNumber,
					seasonId,
					seasonName,
					seasonEpisodeOrder,
					seasonPremiereDate,
					seasonEndDate,
					episodeObjectIds
				};
				const seasonToUpdate = await Season.findOne({seasonId: seasonId});
				if(seasonToUpdate){
					seasonObjectId=seasonToUpdate._id;
					seasonToUpdate.seasonEpisodeOrder = newSeasonData.seasonEpisodeOrder;
					seasonToUpdate.seasonPremiereDate = newSeasonData.seasonPremiereDate;
					seasonToUpdate.seasonEndDate = newSeasonData.seasonEndDate;
					await seasonToUpdate.save();
				}else{
					const newSeasonAdded = await new Season(newSeasonData);
					await newSeasonAdded.save();
					const newSeason = await Season.findOne({seasonId: seasonId});
					seasonObjectId = newSeason._id;
					await show.seasonObjectIds.push(seasonObjectId);
					await show.save();
				};
				// Get episode data for the season
				const seasonEpisodesData = await axios.get(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
				const episodesData = seasonEpisodesData.data;
				for(let episode of episodesData){
					const episodeNumber = episode.number;
					const episodeId = episode.id;
					const episodeTitle = episode.name || undefined;
					const episodeType = episode.type;
					const episodeAirdate = episode.airdate;
					const episodeAirtime = episode.airtime;
					const episodeAirstamp = episode.airstamp;
					const episodeRuntime = episode.runtime;
					const episodeRating = episode.rating.average;
					const episodeSummaryHtml = sanitizeHtml(episode.summary, {allowedTags:['p'], allowedAttributes:{}});
					const episodeImageLink = episode.image && episode.image.original;
					const showName = episode._links.show.name;
					const usersWhoHaveWatched = [];
					const newEpisodeData = {
						showObjectId,
						seasonObjectId,
						seasonNumber,
						episodeNumber,
						episodeId,
						episodeTitle,
						episodeType,
						episodeAirdate,
						episodeAirtime,
						episodeAirstamp,
						episodeRuntime,
						episodeRating,
						episodeSummaryHtml,
						episodeImageLink,
						showName,
						usersWhoHaveWatched
					};
					const episodeToUpdate = await Episode.findOne({episodeId: episodeId});
					if(episodeToUpdate){
						episodeToUpdate.episodeTitle = newEpisodeData.episodeTitle;
						episodeToUpdate.episodeAirdate = newEpisodeData.episodeAirdate;
						episodeToUpdate.episodeAirtime = newEpisodeData.episodeAirtime;
						episodeToUpdate.episodeAirstamp = newEpisodeData.episodeAirstamp;
						episodeToUpdate.episodeRuntime = newEpisodeData.episodeRuntime;
						episodeToUpdate.episodeRating = newEpisodeData.episodeRating;
						episodeToUpdate.episodeSummaryHtml = newEpisodeData.episodeSummaryHtml;
						episodeToUpdate.episodeImageLink = newEpisodeData.episodeImageLink;
						await episodeToUpdate.save();
					}else{
						const newEpisodeAdded = await new Episode(newEpisodeData);
						await newEpisodeAdded.save();
						const newEpisode = await Episode.findOne({episodeId: episodeId});
						const newEpisodeObjectId = newEpisode._id;
						if(seasonToUpdate){
							seasonToUpdate.episodeObjectIds.push(newEpisodeObjectId);
							await seasonToUpdate.save();
						}else{
							const newSeason = await Season.findOne({seasonId: seasonId});
							await newSeason.episodeObjectIds.push(newEpisodeObjectId);
							await newSeason.save();
						};
					};
				};
			};
		};
		const showSeasonObjectIds = show.seasonObjectIds;
		let seasons = [];
		for(let showSeason of showSeasonObjectIds){
			const season = await Season.findById(showSeason).populate('episodeObjectIds');
			seasons.push(season);
		};
		res.status(200).json({
			success: true,
			show,
			seasons
		});
	}catch(err){
		console.log('Error from backend loadShow route: ', err);
	};
};

// Toggle whether or not a given episode has been watched by a given user
exports.toggleEpisodeWatched = async(req, res, next)=>{
	const userId = req.body.user._id;
	const episodeObjectId = req.body.episodeObjectId;
	try{
		const episode = await Episode.findById(episodeObjectId);
		let usersWhoHaveWatched = episode.usersWhoHaveWatched;
		let watchedStatus = '';
		if(usersWhoHaveWatched.includes(userId)){
			await usersWhoHaveWatched.pull({_id: userId});
			await episode.save();
			watchedStatus = 'unwatched';
		}else{
			await usersWhoHaveWatched.push(userId);
			await episode.save();
			watchedStatus = 'watched';
		};
		res.status(200).json({
			success: true,
			watchedStatus,
			episode
		});
	}catch(err){
		console.log('Error from backend toggleEpisodeWatched route: ', err);
	}
}

// Toggle whether or not all the episodes in a given season have been watched by a given user
exports.toggleSeasonWatched = async(req, res, next)=>{
	const userId = req.body.user._id;
	const seasonObjectId = req.body.seasonObjectId;
	try{
		const season = await Season.findById(seasonObjectId);
		const seasonEpisodeObjectIdList = season.episodeObjectIds;
		if(seasonEpisodeObjectIdList.length===0){
			res.status(200).json({
				success: true,
				season,
				seasonEpisodeObjectIdList,
				seasonPremiereDate: season.seasonPremiereDate
			});
		}else{
			let watchedStatus = '';
			let unwatchedEpisodes = [];
			let episodesUpdatedToWatched = [];
			let firstEpisodeOfSeasonNotAiredYet = false;
			let firstEpisodeAirstamp;
			for(let episodeObjectId of seasonEpisodeObjectIdList){
				const episode = await Episode.findById(episodeObjectId);
				let usersWhoHaveWatched = episode.usersWhoHaveWatched;
				if(!usersWhoHaveWatched.includes(userId)){
					unwatchedEpisodes.push(episode._id);
				};
			};
			if(unwatchedEpisodes.length>0){
				watchedStatus = 'watched';
				for(let unwatchedEpisode of unwatchedEpisodes){
					const episode = await Episode.findById(unwatchedEpisode);
					const episodeAirstamp = new Date(episode.episodeAirstamp);
					const currentDatestamp = new Date();
					if(episodeAirstamp<currentDatestamp){
						let usersWhoHaveWatched = episode.usersWhoHaveWatched;
						await usersWhoHaveWatched.push(userId);
						await episode.save();
						await episodesUpdatedToWatched.push(episode._id);
					}else if(episodeAirstamp>=currentDatestamp && episode.episodeNumber===1){
						firstEpisodeOfSeasonNotAiredYet=true;
						firstEpisodeAirstamp=episode.episodeAirstamp;
					};
				};
			}else{
				for(let episodeObjectId of seasonEpisodeObjectIdList){
					const episode = await Episode.findById(episodeObjectId);
					let usersWhoHaveWatched = episode.usersWhoHaveWatched;
					await usersWhoHaveWatched.pull({_id: userId});
					await episode.save();
					watchedStatus = 'unwatched';
				};
			};
			res.status(200).json({
				success: true,
				unwatchedEpisodes,
				episodesUpdatedToWatched,
				firstEpisodeOfSeasonNotAiredYet,
				firstEpisodeAirstamp,
				watchedStatus,
				season,
				seasonEpisodeObjectIdList
			});
		};
	}catch(err){
		console.log('Error from backend toggleSeasonWatched route: ', err);
	};
};

// Retrieve all details for a given show
exports.getShowDetails = async(req, res, next)=>{
	const showObjectId=req.body.showObjectId;
	try{
		const show=await Show.findById(showObjectId);
		res.status(200).json({
			success: true,
			show
		});
	}catch(err){
		console.log('Error from backend getShowDetails route', err);
	};
};

// Retrieve all details for a given episode
exports.getEpisodeDetails = async(req, res, next)=>{
	const episodeObjectId=req.body.episodeObjectId;
	try{
		const episode=await Episode.findById(episodeObjectId);
		const show=await Show.findById(episode.showObjectId);
		res.status(200).json({
			success: true,
			show,
			episode
		});
	}catch(err){
		console.log('Error from backend getEpisodeDetails route', err);
	};
};
