const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const User = require("./userModel.js");
const Show = require("./showModel.js");

const showsSchema = new mongoose.Schema(
  {
    showsListOwner: {
      type: objectId,
      ref: "User",
    },
    shows: [
      {
        type: objectId,
        ref: "Show",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("ShowsList", showsSchema);
