const { Tweet, User } = require("../models");
const { format, formatDistance } = require("date-fns");
const { en } = require("date-fns/locale");

async function register(req, res) {
  res.render("users/sign-up");
}

// Display a listing of the resource.
async function login(req, res) {
  res.render("users/login");
}

// Page Home
async function showHome(req, res) {
  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }])
  const globalUser = await User.findById(req.user.id).populate("following")
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

  return res.json({ allTweets, format, en, formatDistance, usersInfo, globalUser });
}

async function showContact(req, res) {
  res.render("pages/contact");
}

async function showAboutUs(req, res) {
  res.render("pages/aboutUs");
}

async function show404(req, res) {
  res.status(404).render("pages/404");
}

async function users(req, res) {
  console.log("llego");
  const allUsers = await User.find()
  res.json(allUsers)
}



module.exports = {
  login,
  register,
  showHome,
  showContact,
  showAboutUs,
  users
};
