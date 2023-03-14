const { Tweet, User } = require("../models");
const { format, formatDistance } = require("date-fns");
const { en } = require("date-fns/locale");

// Page Home
async function showHome(req, res) {
  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }])
  const userFollowing = await User.findById(req.user._id);
  const followings = userFollowing.following;
  const users = await User.find({ _id: { $in: followings } }).populate("tweets")
  const allUsersTweets = []
  const allTweets = []
  const userTweets = await User.findById(req.user.id).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  const myTweets = userTweets.tweets
  allUsersTweets.push(...myTweets);

  for (const newuser of users) {
    const tweets = newuser.tweets
    allUsersTweets.push(...tweets);
  }

  for (const tweet of allUsersTweets) {
    const tweetsWithUser = await Tweet.find(tweet._id).populate({ path: "user", options: { sort: { createdAt: -1 } } }).populate("likes")
    allTweets.push(...tweetsWithUser)
  }

  return res.json({ allTweets, format, en, formatDistance, usersInfo });
}



module.exports = {
  showHome,
};
