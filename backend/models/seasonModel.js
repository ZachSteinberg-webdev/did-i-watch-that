const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const Show = require("./showModel.js");
const Episode = require("./episodeModel.js");

const seasonSchema = new mongoose.Schema(
  {
    showObjectId: {
      type: objectId,
      ref: "Show",
    },
    seasonNumber: {
      type: Number,
    },
    seasonId: {
      type: Number,
    },
    seasonName: {
      type: String,
    },
    seasonEpisodeOrder: {
      type: Number,
    },
    seasonPremiereDate: {
      type: String,
    },
    seasonEndDate: {
      type: String,
    },
    episodeObjectIds: [
      {
        type: objectId,
        ref: "Episode",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Season", seasonSchema);
