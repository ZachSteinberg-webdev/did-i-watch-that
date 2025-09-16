const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const User = require("./userModel.js");
const ShowsList = require("./showsListModel.js");
const Season = require("./seasonModel.js");

const showSchema = new mongoose.Schema(
  {
    showId: {
      type: Number,
    },
    showName: {
      type: String,
    },
    showPremiereDate: {
      type: String,
    },
    showEndedDate: {
      type: String,
    },
    showAverageRuntime: {
      type: Number,
    },
    showRuntime: {
      type: Number,
    },
    showImdbId: {
      type: String,
    },
    showTheTvdbNumber: {
      type: Number,
    },
    showGenres: [
      {
        type: String,
      },
    ],
    showImageLink: {
      type: String,
    },
    showLanguage: {
      type: String,
    },
    showNetwork: {
      type: String,
    },
    showNetworkWebsiteLink: {
      type: String,
    },
    showCountry: {
      type: String,
    },
    showWebsiteLink: {
      type: String,
    },
    showAverageRating: {
      type: Number,
    },
    showAirDays: [
      {
        type: String,
      },
    ],
    showAirTime: {
      type: String,
    },
    showStatus: {
      type: String,
    },
    showSummaryHtml: {
      type: String,
    },
    showType: {
      type: String,
    },
    showUpdatedEpoch: {
      type: Number,
    },
    showWebChannelName: {
      type: String,
    },
    showWebChannelWebsiteLink: {
      type: String,
    },
    seasonObjectIds: [
      {
        type: objectId,
        ref: "Season",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Show", showSchema);
