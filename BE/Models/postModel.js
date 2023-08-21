const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    device: { type: String, required: true },
    no_of_comments: { type: Number, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
  },
  { versionKey: false }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = {
  postModel,
};
