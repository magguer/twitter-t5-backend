const { User } = require("../models");
const { format, formatDistance } = require("date-fns");
const { en } = require("date-fns/locale");

/* Página Followers */
async function followers(req, res) {
  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]);
  const userFollowers = await User.findOne({ username: req.params.username });
  const followers = userFollowers.followers;
  const users = await User.find({ _id: { $in: followers } });
  return res.json({ users, userFollowers, usersInfo });
}

/* Página Following */
async function following(req, res) {
  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]);
  const userFollowing = await User.findOne({ username: req.params.username });
  const followings = userFollowing.following;
  const users = await User.find({ _id: { $in: followings } });
  return res.json({ users, userFollowing, usersInfo });
}

/*  Perfil de Usuario */
async function profile(req, res) {
  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]);
  const userProfile = await User.findOne({
    username: req.params.username,
  }).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  //const userTweets = await User.findById(req.user.id).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  return res.json({
    userProfile,
    format,
    en,
    formatDistance,
    usersInfo,
  });
}

async function bannerEdit(req, res) {
  await User.findByIdAndUpdate(req.user.id, {
    banner: req.body.banner,
  });
  return res.redirect("back");
}

/* Función Follow */
async function follow(req, res) {
  const userId = req.user.id;
  const follow = req.params.id;

  await User.findByIdAndUpdate(userId, {
    $push: { following: follow },
  });
  await User.findByIdAndUpdate(follow, {
    $push: { followers: userId },
  });
  res.redirect("back");
}

/* Función Unfollow */
async function unfollow(req, res) {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user.id },
  });
  res.redirect("back");
}

module.exports = {
  followers,
  following,
  follow,
  unfollow,
  profile,
  bannerEdit,
};
