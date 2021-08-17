const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    youtube_uri: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },    
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
