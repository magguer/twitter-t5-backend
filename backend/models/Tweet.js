const { Schema, mongoose } = require("../db");

const tweetSchema = new Schema(
  {
    text: {
      type: String,
      minlength: 1,
      maxlength: 140,
      required: [true, "Inserte un texto"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
