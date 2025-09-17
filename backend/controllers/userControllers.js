const axios = require("axios");
const User = require("../models/userModel.js");
const ShowsList = require("../models/showsListModel.js");
const Show = require("../models/showModel.js");
const Episode = require("../models/episodeModel.js");
const ErrorResponse = require("../utilities/errorResponse.js");
const generateToken = require("../utilities/generateToken.js");
const bcrypt = require("bcryptjs");
const { _addShowForUser: addShowForUser } = require("./showControllers.js");

// Test that API is up and running
exports.sayHello = (req, res) => {
  res.json({ message: "User controller is working" });
};

// Register user
exports.register = async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(
      new ErrorResponse("A user with this email address already exists.", 400),
    );
  }
  try {
    const user = await User.create(req.body);
    generateToken(user, 201, res); // generateToken handles the res.status().cookie().json() call
  } catch (err) {
    return next(err);
  }
};

// Log in user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let errorMessages = [];
    // Check if email and password were provided
    if (!email) {
      errorMessages.push("Please provide your email address.");
    }
    if (!password) {
      errorMessages.push("Please provide your password.");
    }
    if (errorMessages.length > 0) {
      return res.status(400).json({
        success: false,
        error: errorMessages,
      });
    }
    // Find user by email address and verify user's password
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse(["Invalid credentials provided."], 400));
    }
    // Verify user's password
    const doesPasswordMatch = await user.comparePassword(password);
    if (!doesPasswordMatch) {
      return next(new ErrorResponse(["Invalid credentials provided."], 400));
    }
    generateToken(user, 200, res); // generateToken handles the res.status().cookie().json() call
  } catch (err) {
    return next(
      new ErrorResponse(
        ["Cannot perform login request at the moment. Please try again later."],
        400,
      ),
    );
  }
};

// Log out user
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Goodbye! We hope to see you again soon.",
    });
  } catch (err) {
    return next(new ErrorResponse(["Logout failed. Please try again."], 400));
  }
};

// Find single user
exports.singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(
      new ErrorResponse([`User with id ${req.params.id} does not exist.`], 404),
    );
  }
};

// Get user profile
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(
      new ErrorResponse(["Could not find user. Please try again later."], 404),
    );
  }
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const oldName = req.user.name;
  const oldEmail = req.user.email;
  const newName = req.body.name;
  const newEmail = req.body.email;
  if (oldName !== newName || oldEmail !== newEmail) {
    try {
      const updatedUserInfo = {};
      if (newName !== "") {
        updatedUserInfo.name = newName;
      }
      if (newEmail !== "") {
        updatedUserInfo.email = newEmail;
      }
      const updateUser = await user.updateOne(updatedUserInfo, {
        runValidators: true,
      });
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      return next(err);
    }
  } else {
    res.status(200).json({
      success: false,
      user,
    });
  }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { oldPassword, newPassword } = req.body;
  const doesPasswordMatch = await user.comparePassword(oldPassword);
  if (!oldPassword && !newPassword) {
    res.status(200).json({
      success: false,
    });
  } else if (oldPassword === "" && newPassword === "") {
    res.status(200).json({
      success: false,
    });
  } else if (
    (oldPassword || oldPassword !== "") &&
    (!newPassword || newPassword === "")
  ) {
    return next(
      new ErrorResponse(
        ["Please provide a new password to update your password."],
        400,
      ),
    );
  } else if (
    (!oldPassword || oldPassword === "") &&
    (newPassword || newPassword !== "")
  ) {
    return next(
      new ErrorResponse(
        ["Please provide your old password to update your password."],
        400,
      ),
    );
  } else if (!doesPasswordMatch) {
    return next(
      new ErrorResponse(["The old password you provided is incorrect."], 400),
    );
  } else if (doesPasswordMatch) {
    try {
      user.password = newPassword;
      await user.save();
      generateToken(user, 201, res); // generateToken handles the res.status().cookie().json() call
    } catch (err) {
      return next(err);
    }
  } else {
    return next(
      new ErrorResponse(
        ["Unable to update password. Please try again later."],
        500,
      ),
    );
  }
};

// Toggle user dark mode setting
exports.toggleDarkMode = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const darkModeSetting = req.body.darkModeSetting;
  try {
    if (darkModeSetting === true) {
      user.prefersDarkMode = true;
    } else if (darkModeSetting === false) {
      user.prefersDarkMode = false;
    }
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    return next(
      new ErrorResponse(
        ["We couldn't update your display preference. Please try again."],
        500,
      ),
    );
  }
};

exports.migrateGuestData = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return next(
        new ErrorResponse(["Please log in to migrate guest data."], 401),
      );
    }
    const trackedShows = req.body.trackedShows || [];
    const watchedEpisodesMap = req.body.watchedEpisodes || {};
    const unifiedShowIds = new Set();
    trackedShows.forEach((show) => {
      const id = show && (show.showId || show.id);
      if (id !== undefined && id !== null) {
        unifiedShowIds.add(String(id));
      }
    });
    Object.keys(watchedEpisodesMap).forEach((key) => {
      if (key !== undefined && key !== null) {
        unifiedShowIds.add(String(key));
      }
    });

    for (const showIdString of Array.from(unifiedShowIds)) {
      const tvmazeId = Number(showIdString);
      if (Number.isNaN(tvmazeId)) {
        return next(
          new ErrorResponse(
            [
              `Guest migration failed because show id "${showIdString}" is invalid.`,
            ],
            400,
          ),
        );
      }
      const tvmazeResponse = await axios.get(
        `https://api.tvmaze.com/shows/${tvmazeId}`,
      );
      const showData = tvmazeResponse.data;
      showData.id = showData.id || tvmazeId;
      await addShowForUser(userId, showData);
      const watchedEpisodeIdsRaw =
        watchedEpisodesMap[showIdString] ||
        watchedEpisodesMap[tvmazeId] ||
        watchedEpisodesMap[String(tvmazeId)] ||
        [];
      if (Array.isArray(watchedEpisodeIdsRaw) && watchedEpisodeIdsRaw.length > 0) {
        const watchedEpisodeIds = watchedEpisodeIdsRaw
          .map((id) => Number(id))
          .filter((id) => !Number.isNaN(id));
        if (watchedEpisodeIds.length > 0) {
          const episodes = await Episode.find({
            episodeId: { $in: watchedEpisodeIds },
          });
          for (const episode of episodes) {
            if (
              !episode.usersWhoHaveWatched.some(
                (userObjectId) => String(userObjectId) === String(userId),
              )
            ) {
              episode.usersWhoHaveWatched.push(userId);
              await episode.save();
            }
          }
        }
      }
    }
    const showsList = await ShowsList.findOne({
      showsListOwner: userId,
    }).populate("shows");
    res
      .status(200)
      .json({ success: true, showsList: showsList || { shows: [] } });
  } catch (err) {
    return next(err);
  }
};
