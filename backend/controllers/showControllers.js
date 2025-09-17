const axios = require("axios");
const sanitizeHtml = require("sanitize-html");
const User = require("../models/userModel.js");
const ShowsList = require("../models/showsListModel.js");
const Show = require("../models/showModel.js");
const Season = require("../models/seasonModel.js");
const Episode = require("../models/episodeModel.js");
const ErrorResponse = require("../utilities/errorResponse.js");

const ensureShowsList = async (userId) => {
  let userShowsList = await ShowsList.findOne({ showsListOwner: userId });
  if (!userShowsList) {
    userShowsList = await new ShowsList({ showsListOwner: userId, shows: [] });
    await userShowsList.save();
  }
  return userShowsList;
};

const idsMatch = (a, b) => String(a) === String(b);

const resolveUserId = (req) => {
  if (req.user) {
    return req.user._id || req.user.id;
  }
  if (req.body && req.body.user) {
    return req.body.user._id;
  }
  return undefined;
};

const syncShowContent = async (show) => {
  const showSeasonsData = await axios.get(
    `https://api.tvmaze.com/shows/${show.showId}/seasons`,
  );
  const seasonsData = showSeasonsData.data || [];
  const showObjectId = show._id;
  for (const season of seasonsData) {
    let seasonDoc = await Season.findOne({ seasonId: season.id });
    if (seasonDoc) {
      seasonDoc.seasonEpisodeOrder = season.episodeOrder;
      seasonDoc.seasonPremiereDate = season.premiereDate;
      seasonDoc.seasonEndDate = season.endDate;
      await seasonDoc.save();
    } else {
      const newSeason = await new Season({
        showObjectId,
        seasonNumber: season.number,
        seasonId: season.id,
        seasonName: season.name,
        seasonEpisodeOrder: season.episodeOrder,
        seasonPremiereDate: season.premiereDate,
        seasonEndDate: season.endDate,
        episodeObjectIds: [],
      });
      await newSeason.save();
      seasonDoc = await Season.findOne({ seasonId: season.id });
    }
    if (!show.seasonObjectIds.some((id) => idsMatch(id, seasonDoc._id))) {
      show.seasonObjectIds.push(seasonDoc._id);
      await show.save();
    }
    const seasonEpisodesData = await axios.get(
      `https://api.tvmaze.com/seasons/${season.id}/episodes`,
    );
    const episodesData = seasonEpisodesData.data || [];
    for (const episode of episodesData) {
      let episodeDoc = await Episode.findOne({ episodeId: episode.id });
      const episodePayload = {
        showObjectId,
        seasonObjectId: seasonDoc._id,
        seasonNumber: episode.season,
        episodeNumber: episode.number,
        episodeId: episode.id,
        episodeTitle: episode.name || undefined,
        episodeType: episode.type,
        episodeAirdate: episode.airdate,
        episodeAirtime: episode.airtime,
        episodeAirstamp: episode.airstamp,
        episodeRuntime: episode.runtime,
        episodeRating: episode.rating?.average,
        episodeSummaryHtml: sanitizeHtml(episode.summary, {
          allowedTags: ["p"],
          allowedAttributes: {},
        }),
        episodeImageLink: episode.image && episode.image.original,
        showName: episode._links?.show?.name,
        usersWhoHaveWatched: episodeDoc ? episodeDoc.usersWhoHaveWatched : [],
      };
      if (episodeDoc) {
        episodeDoc.episodeTitle = episodePayload.episodeTitle;
        episodeDoc.episodeAirdate = episodePayload.episodeAirdate;
        episodeDoc.episodeAirtime = episodePayload.episodeAirtime;
        episodeDoc.episodeAirstamp = episodePayload.episodeAirstamp;
        episodeDoc.episodeRuntime = episodePayload.episodeRuntime;
        episodeDoc.episodeRating = episodePayload.episodeRating;
        episodeDoc.episodeSummaryHtml = episodePayload.episodeSummaryHtml;
        episodeDoc.episodeImageLink = episodePayload.episodeImageLink;
        await episodeDoc.save();
      } else {
        const newEpisode = await new Episode(episodePayload);
        await newEpisode.save();
        episodeDoc = await Episode.findOne({ episodeId: episode.id });
      }
      if (
        !seasonDoc.episodeObjectIds.some((id) => idsMatch(id, episodeDoc._id))
      ) {
        seasonDoc.episodeObjectIds.push(episodeDoc._id);
        await seasonDoc.save();
      }
    }
  }
};

const addShowForUser = async (userId, postedShowData) => {
  const userShowsList = await ensureShowsList(userId);
  const listOfShowsTrackedByUser = userShowsList.shows;
  let existingShow = await Show.findOne({ showId: postedShowData.id });
  const existingShowObjectId = existingShow ? existingShow._id : undefined;
  if (
    existingShowObjectId &&
    listOfShowsTrackedByUser.some((showId) =>
      idsMatch(showId, existingShowObjectId),
    )
  ) {
    return {
      success: false,
      error: ["You are already tracking that show!"],
      show: existingShow,
    };
  }
  if (existingShowObjectId) {
    const showLastUpdatedInDatabaseEpoch = Math.floor(
      Date.parse(existingShow.updatedAt) / 1000,
    );
    const showLastUpdatedByApiEpoch = postedShowData.updated;
    if (showLastUpdatedByApiEpoch > showLastUpdatedInDatabaseEpoch) {
      existingShow.showName = postedShowData.name;
      existingShow.showPremiereDate = postedShowData.premiered;
      existingShow.showEndedDate = postedShowData.ended;
      existingShow.showAverageRuntime = postedShowData.averageRuntime;
      existingShow.showRuntime = postedShowData.runtime;
      existingShow.showImdbId = postedShowData.externals?.imdb;
      existingShow.showTheTvdbNumber = postedShowData.externals?.thetvdb;
      existingShow.showGenres = postedShowData.genres;
      existingShow.showImageLink =
        postedShowData.image && postedShowData.image.original;
      existingShow.showLanguage = postedShowData.language;
      existingShow.showNetwork =
        postedShowData.network && postedShowData.network.name;
      existingShow.showNetworkWebsiteLink =
        postedShowData.network && postedShowData.network.officialSite;
      existingShow.showCountry =
        postedShowData.network &&
        postedShowData.network.country &&
        postedShowData.network.country.name;
      existingShow.showWebsiteLink = postedShowData.officialSite;
      existingShow.showAverageRating =
        postedShowData.rating && postedShowData.rating.average;
      existingShow.showAirDays =
        postedShowData.schedule && postedShowData.schedule.days;
      existingShow.showAirTime =
        postedShowData.schedule && postedShowData.schedule.time;
      existingShow.showStatus = postedShowData.status;
      existingShow.showSummaryHtml = sanitizeHtml(postedShowData.summary, {
        allowedTags: ["p"],
        allowedAttributes: {},
      });
      existingShow.showType = postedShowData.type;
      existingShow.showUpdatedEpoch = postedShowData.updated;
      existingShow.showWebChannelName =
        postedShowData.webChannel && postedShowData.webChannel.name;
      existingShow.showWebChannelWebsiteLink =
        postedShowData.webChannel && postedShowData.webChannel.officialSite;
      await existingShow.save();
    }
    await syncShowContent(existingShow);
    if (
      !listOfShowsTrackedByUser.some((showId) =>
        idsMatch(showId, existingShowObjectId),
      )
    ) {
      listOfShowsTrackedByUser.unshift(existingShowObjectId);
    }
    await userShowsList.save();
    const returnedListOfTrackedShows = await ShowsList.findOne({
      showsListOwner: userId,
    }).populate("shows");
    return {
      success: true,
      message: [
        `"${
          existingShow.showName || postedShowData.name
        }" has been added to your list of tracked shows!`,
      ],
      returnedListOfTrackedShows,
      show: existingShow,
    };
  }
  const newShow = {
    showId: postedShowData.id,
    showName: postedShowData.name,
    showPremiereDate: postedShowData.premiered,
    showEndedDate: postedShowData.ended,
    showAverageRuntime: postedShowData.averageRuntime,
    showRuntime: postedShowData.runtime,
    showImdbId: postedShowData.externals?.imdb,
    showTheTvdbNumber: postedShowData.externals?.thetvdb,
    showGenres: postedShowData.genres,
    showImageLink: postedShowData.image && postedShowData.image.original,
    showLanguage: postedShowData.language,
    showNetwork: postedShowData.network && postedShowData.network.name,
    showNetworkWebsiteLink:
      postedShowData.network && postedShowData.network.officialSite,
    showCountry:
      postedShowData.network &&
      postedShowData.network.country &&
      postedShowData.network.country.name,
    showWebsiteLink: postedShowData.officialSite,
    showAverageRating: postedShowData.rating && postedShowData.rating.average,
    showAirDays: postedShowData.schedule && postedShowData.schedule.days,
    showAirTime: postedShowData.schedule && postedShowData.schedule.time,
    showStatus: postedShowData.status,
    showSummaryHtml: sanitizeHtml(postedShowData.summary, {
      allowedTags: ["p"],
      allowedAttributes: {},
    }),
    showType: postedShowData.type,
    showUpdatedEpoch: postedShowData.updated,
    showWebChannelName:
      postedShowData.webChannel && postedShowData.webChannel.name,
    showWebChannelWebsiteLink:
      postedShowData.webChannel && postedShowData.webChannel.officialSite,
    seasonObjectIds: [],
  };
  const newShowAdded = await new Show(newShow);
  await newShowAdded.save();
  await syncShowContent(newShowAdded);
  const createdShow = await Show.findOne({ showId: postedShowData.id });
  listOfShowsTrackedByUser.unshift(createdShow._id);
  await userShowsList.save();
  const returnedListOfTrackedShows = await ShowsList.findOne({
    showsListOwner: userId,
  }).populate("shows");
  return {
    success: true,
    message: [
      `"${
        createdShow.showName || postedShowData.name
      }" has been added to your list of tracked shows!`,
    ],
    returnedListOfTrackedShows,
    show: createdShow,
  };
};

// Get all tracked shows of a given user
exports.getShows = async (req, res, next) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return next(new ErrorResponse(["Unable to determine user."], 400));
    }
    const user = await User.findById(userId);
    const showsList = await ShowsList.find({
      showsListOwner: user._id,
    }).populate("shows");
    res.status(200).json({
      success: true,
      showsList,
    });
  } catch (err) {
    return next(err);
  }
};

// Add a show to a user's tracked shows list
exports.addShow = async (req, res, next) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return next(new ErrorResponse(["Unable to determine user."], 400));
    }
    const postedShowData = req.body.postedShowDataObject;
    const result = await addShowForUser(userId, postedShowData);
    if (result.success === false) {
      return res.status(200).json({ success: false, error: result.error });
    }
    return res.status(201).json({
      success: true,
      message: result.message,
      returnedListOfTrackedShows: result.returnedListOfTrackedShows,
    });
  } catch (err) {
    return next(err);
  }
};

// Delete a show from a user's list of tracked shows
exports.deleteShow = async (req, res, next) => {
  try {
    // Store necessary data as variables
    const userId = resolveUserId(req);
    if (!userId) {
      return next(new ErrorResponse(["Unable to determine user."], 400));
    }
    const showObjectId = req.body.showObjectId;
    // Pull up show by ObjectId
    const show = await Show.findById(showObjectId);
    // Store showName for later use in returned JSON object
    const showName = show.showName;
    // Pull up user's list of tracked shows
    const userShowsList = await ShowsList.findOne({ showsListOwner: userId });
    // Store array of show ObjectIds
    const listOfShowsTrackedByUser = userShowsList.shows;
    // If user has tracked shows list and tracked shows list contains specified show, remove show from list
    if (userShowsList && listOfShowsTrackedByUser.includes(showObjectId)) {
      await userShowsList.shows.pull({ _id: showObjectId });
      // Save user's updated tracked shows list
      await userShowsList.save();
      // Generate new list of user's tracked shows
      const returnedListOfTrackedShows = await ShowsList.findOne({
        showsListOwner: userId,
      }).populate("shows");
      // Store message to be sent to frontend in JSON object
      const message = [
        `"${showName}" has been removed from your list of tracked shows!`,
      ];
      // Send new list of user's tracked show back to frontend
      return res
        .status(200)
        .json({ success: true, message: message, returnedListOfTrackedShows });
    } else {
      const message = [
        "Hmmm... That show was not found in your tracked shows list. Strange!",
      ];
      return res.status(400).json({ success: false, message: message });
    }
  } catch (err) {
    return next(err);
  }
};

// Sort a user's list of shows alphabetically by show name
exports.sortShows = async (req, res, next) => {
  // Store necessary data as variables
  const userId = resolveUserId(req);
  if (!userId) {
    return next(new ErrorResponse(["Unable to determine user."], 400));
  }
  try {
    // Pull up list of user's tracked shows
    const showsList = await ShowsList.findOne({ showsListOwner: userId });
    // Extract array of show objectIds
    const showsListShows = showsList.shows;
    // Pull up list of user's tracked shows (populated and sorted alphabetically by showName)
    const showsListPopulatedSorted = await ShowsList.findOne({
      showsListOwner: userId,
    }).populate({ path: "shows", options: { sort: { showName: 1 } } });
    // Extract populated array of Show Objects
    const showsListPopulatedSortedShows = showsListPopulatedSorted.shows;
    // Build array of just Show ObjectIds as strings
    const showsObjectIdArray = showsListPopulatedSortedShows.map((show) => {
      return show["_id"];
    });
    // Create a JSON string out of each version of the user's shows list (old and new)
    const showsListShowsString = JSON.stringify(showsListShows);
    const showsObjectIdArrayString = JSON.stringify(showsObjectIdArray);
    // Compare old and new arrays
    if (showsListShowsString === showsObjectIdArrayString) {
      // If both arrays are equal, let user know and return list of tracked shows
      const message = ["Your shows are already in alphabetical order!"];
      return res.status(200).json({ success: false, error: message });
    } else {
      // Set "shows" ObjectId array equal to the sorted array of ObjectId strings
      showsListPopulatedSorted.shows = showsObjectIdArray;
      // Save updated ShowsList document
      await showsListPopulatedSorted.save();
      // Store message to send to frontend in JSON object
      const message = ["Your shows have been sorted alphabetically."];
      // Generate new, sorted list of user's tracked shows
      const returnedListOfTrackedShows = await ShowsList.findOne({
        showsListOwner: userId,
      }).populate("shows");
      // Send new, sorted list of user's tracked shows to frontend
      return res
        .status(200)
        .json({ success: true, message: message, returnedListOfTrackedShows });
    }
  } catch (err) {
    return next(err);
  }
};

// Load show tracking for a specific show tracked by a given user
exports.loadShow = async (req, res, next) => {
  const userId = resolveUserId(req);
  if (!userId) {
    return next(new ErrorResponse(["Unable to determine user."], 400));
  }
  const showObjectId = req.body.showObjectId;
  try {
    // Pull up existing show from Show collection
    const show = await Show.findById(showObjectId);
    const showLastUpdatedInDatabaseEpoch = Math.floor(
      Date.parse(show.updatedAt) / 1000,
    );
    const data = await axios.get(`https://api.tvmaze.com/shows/${show.showId}`);
    const showData = data.data;
    const showLastUpdatedByApiEpoch = showData.updated;
    if (showLastUpdatedByApiEpoch > showLastUpdatedInDatabaseEpoch) {
      show.showName = showData.name;
      show.showPremiereDate = showData.premiered;
      show.showEndedDate = showData.ended;
      show.showAverageRuntime = showData.averageRuntime;
      show.showRuntime = showData.runtime;
      show.showImdbId = showData.externals.imdb;
      show.showTheTvdbNumber = showData.externals.thetvdb;
      show.showGenres = showData.genres;
      show.showImageLink = showData.image && showData.image.original;
      show.showLanguage = showData.language;
      show.showNetwork = showData.network && showData.network.name;
      show.showNetworkWebsiteLink =
        showData.network && showData.network.officialSite;
      show.showCountry = showData.network && showData.network.country.name;
      show.showWebsiteLink = showData.officialSite;
      show.showAverageRating = showData.rating.average;
      show.showAirDays = showData.schedule.days;
      show.showAirTime = showData.schedule.time;
      show.showStatus = showData.status;
      show.showSummaryHtml = sanitizeHtml(showData.summary, {
        allowedTags: ["p"],
        allowedAttributes: {},
      });
      show.showType = showData.type;
      show.showUpdatedEpoch = showData.updated;
      show.showWebChannelName = showData.webChannel && showData.webChannel.name;
      show.showWebChannelWebsiteLink =
        showData.webChannel && showData.webChannel.officialSite;
      await show.save();
      // Get show season data from tvmaze API
      const showSeasonsData = await axios.get(
        `https://api.tvmaze.com/shows/${show.showId}/seasons`,
      );
      const seasonsData = showSeasonsData.data;
      // Store necessary season data as variables
      const showObjectId = show._id;
      // Loop over array of seasons, pull each season's pertinent data and update Season document for it
      for (let season of seasonsData) {
        let seasonObjectId = "";
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
          episodeObjectIds,
        };
        const seasonToUpdate = await Season.findOne({ seasonId: seasonId });
        if (seasonToUpdate) {
          seasonObjectId = seasonToUpdate._id;
          seasonToUpdate.seasonEpisodeOrder = newSeasonData.seasonEpisodeOrder;
          seasonToUpdate.seasonPremiereDate = newSeasonData.seasonPremiereDate;
          seasonToUpdate.seasonEndDate = newSeasonData.seasonEndDate;
          await seasonToUpdate.save();
        } else {
          const newSeasonAdded = await new Season(newSeasonData);
          await newSeasonAdded.save();
          const newSeason = await Season.findOne({ seasonId: seasonId });
          seasonObjectId = newSeason._id;
          await show.seasonObjectIds.push(seasonObjectId);
          await show.save();
        }
        // Get episode data for the season
        const seasonEpisodesData = await axios.get(
          `https://api.tvmaze.com/seasons/${seasonId}/episodes`,
        );
        const episodesData = seasonEpisodesData.data;
        for (let episode of episodesData) {
          const episodeNumber = episode.number;
          const episodeId = episode.id;
          const episodeTitle = episode.name || undefined;
          const episodeType = episode.type;
          const episodeAirdate = episode.airdate;
          const episodeAirtime = episode.airtime;
          const episodeAirstamp = episode.airstamp;
          const episodeRuntime = episode.runtime;
          const episodeRating = episode.rating.average;
          const episodeSummaryHtml = sanitizeHtml(episode.summary, {
            allowedTags: ["p"],
            allowedAttributes: {},
          });
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
            usersWhoHaveWatched,
          };
          const episodeToUpdate = await Episode.findOne({
            episodeId: episodeId,
          });
          if (episodeToUpdate) {
            episodeToUpdate.episodeTitle = newEpisodeData.episodeTitle;
            episodeToUpdate.episodeAirdate = newEpisodeData.episodeAirdate;
            episodeToUpdate.episodeAirtime = newEpisodeData.episodeAirtime;
            episodeToUpdate.episodeAirstamp = newEpisodeData.episodeAirstamp;
            episodeToUpdate.episodeRuntime = newEpisodeData.episodeRuntime;
            episodeToUpdate.episodeRating = newEpisodeData.episodeRating;
            episodeToUpdate.episodeSummaryHtml =
              newEpisodeData.episodeSummaryHtml;
            episodeToUpdate.episodeImageLink = newEpisodeData.episodeImageLink;
            await episodeToUpdate.save();
          } else {
            const newEpisodeAdded = await new Episode(newEpisodeData);
            await newEpisodeAdded.save();
            const newEpisode = await Episode.findOne({ episodeId: episodeId });
            const newEpisodeObjectId = newEpisode._id;
            if (seasonToUpdate) {
              seasonToUpdate.episodeObjectIds.push(newEpisodeObjectId);
              await seasonToUpdate.save();
            } else {
              const newSeason = await Season.findOne({ seasonId: seasonId });
              await newSeason.episodeObjectIds.push(newEpisodeObjectId);
              await newSeason.save();
            }
          }
        }
      }
    }
    const showSeasonObjectIds = show.seasonObjectIds;
    let seasons = [];
    for (let showSeason of showSeasonObjectIds) {
      const season =
        await Season.findById(showSeason).populate("episodeObjectIds");
      seasons.push(season);
    }
    res.status(200).json({
      success: true,
      show,
      seasons,
    });
  } catch (err) {
    return next(err);
  }
};

// Toggle whether or not a given episode has been watched by a given user
exports.toggleEpisodeWatched = async (req, res, next) => {
  const userId = resolveUserId(req);
  if (!userId) {
    return next(new ErrorResponse(["Unable to determine user."], 400));
  }
  const episodeObjectId = req.body.episodeObjectId;
  try {
    const episode = await Episode.findById(episodeObjectId);
    let usersWhoHaveWatched = episode.usersWhoHaveWatched;
    let watchedStatus = "";
    if (usersWhoHaveWatched.includes(userId)) {
      await usersWhoHaveWatched.pull({ _id: userId });
      await episode.save();
      watchedStatus = "unwatched";
    } else {
      await usersWhoHaveWatched.push(userId);
      await episode.save();
      watchedStatus = "watched";
    }
    res.status(200).json({
      success: true,
      watchedStatus,
      episode,
    });
  } catch (err) {
    return next(err);
  }
};

// Toggle whether or not all the episodes in a given season have been watched by a given user
exports.toggleSeasonWatched = async (req, res, next) => {
  const userId = resolveUserId(req);
  if (!userId) {
    return next(new ErrorResponse(["Unable to determine user."], 400));
  }
  const seasonObjectId = req.body.seasonObjectId;
  try {
    const season = await Season.findById(seasonObjectId);
    const seasonEpisodeObjectIdList = season.episodeObjectIds;
    if (seasonEpisodeObjectIdList.length === 0) {
      res.status(200).json({
        success: true,
        season,
        seasonEpisodeObjectIdList,
        seasonPremiereDate: season.seasonPremiereDate,
      });
    } else {
      let watchedStatus = "";
      let unwatchedEpisodes = [];
      let episodesUpdatedToWatched = [];
      let firstEpisodeOfSeasonNotAiredYet = false;
      let firstEpisodeAirstamp;
      for (let episodeObjectId of seasonEpisodeObjectIdList) {
        const episode = await Episode.findById(episodeObjectId);
        let usersWhoHaveWatched = episode.usersWhoHaveWatched;
        if (!usersWhoHaveWatched.includes(userId)) {
          unwatchedEpisodes.push(episode._id);
        }
      }
      if (unwatchedEpisodes.length > 0) {
        watchedStatus = "watched";
        for (let unwatchedEpisode of unwatchedEpisodes) {
          const episode = await Episode.findById(unwatchedEpisode);
          const episodeAirstamp = new Date(episode.episodeAirstamp);
          const currentDatestamp = new Date();
          if (episodeAirstamp < currentDatestamp) {
            let usersWhoHaveWatched = episode.usersWhoHaveWatched;
            await usersWhoHaveWatched.push(userId);
            await episode.save();
            await episodesUpdatedToWatched.push(episode._id);
          } else if (
            episodeAirstamp >= currentDatestamp &&
            episode.episodeNumber === 1
          ) {
            firstEpisodeOfSeasonNotAiredYet = true;
            firstEpisodeAirstamp = episode.episodeAirstamp;
          }
        }
      } else {
        for (let episodeObjectId of seasonEpisodeObjectIdList) {
          const episode = await Episode.findById(episodeObjectId);
          let usersWhoHaveWatched = episode.usersWhoHaveWatched;
          await usersWhoHaveWatched.pull({ _id: userId });
          await episode.save();
          watchedStatus = "unwatched";
        }
      }
      res.status(200).json({
        success: true,
        unwatchedEpisodes,
        episodesUpdatedToWatched,
        firstEpisodeOfSeasonNotAiredYet,
        firstEpisodeAirstamp,
        watchedStatus,
        season,
        seasonEpisodeObjectIdList,
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Retrieve all details for a given show
exports.getShowDetails = async (req, res, next) => {
  const showObjectId = req.body.showObjectId;
  try {
    const show = await Show.findById(showObjectId);
    res.status(200).json({
      success: true,
      show,
    });
  } catch (err) {
    return next(err);
  }
};

// Retrieve all details for a given episode
exports.getEpisodeDetails = async (req, res, next) => {
  const episodeObjectId = req.body.episodeObjectId;
  try {
    const episode = await Episode.findById(episodeObjectId);
    const show = await Show.findById(episode.showObjectId);
    res.status(200).json({
      success: true,
      show,
      episode,
    });
  } catch (err) {
    return next(err);
  }
};

exports._addShowForUser = addShowForUser;
