const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { versionKey: false }
);

const blacklistModel = mongoose.model("Blacklist", blacklistSchema);

module.exports = {
  blacklistModel,
};
