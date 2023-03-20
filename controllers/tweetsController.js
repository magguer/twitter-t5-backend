const { Tweet, User } = require("../models");

// GET - Tweets
async function index(req, res) {
  const user = await User.findById(req.auth.id);
  const tweets = await Tweet.find({ user: { $in: [user, ...user.following] } })
    .sort({ createdAt: -1 })
    .populate("user")
    .populate("likes");
  return res.json({
    tweets,
  });
}

// POST - Tweet
async function store(req, res) {
  console.log(req.body.tweet);
  const newTweet = new Tweet({
    user: req.auth.id, //auth por jwt en vez de .user
    text: req.body.tweet, // mismo nombre del value
  });
  newTweet.save();
  await User.findByIdAndUpdate(req.auth.id, { $push: { tweets: newTweet } });
  return res.status(200).json("OK");
}

// DELETE - Tweet
async function destroy(req, res) {
  await Tweet.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.auth.id, {
    $pull: { tweets: req.params.id },
  });
  return res.status(200).json("OK");
}

// PATCH - Like
async function likeTweet(req, res) {
  const tweetId = req.params.id;
  const userId = req.auth.id;
  await Tweet.findByIdAndUpdate(tweetId, {
    $push: { likes: userId },
  });
  return res.status(200).json("OK");
}

// PATCH - Unlike
async function dislikeTweet(req, res) {
  const tweetId = req.params.id;
  const userId = req.auth.id;
  await Tweet.findByIdAndUpdate(tweetId, {
    $pull: { likes: userId },
  });
  return res.status(200).json("OK");
}

module.exports = {
  index,
  store,
  destroy,
  likeTweet,
  dislikeTweet,
};
