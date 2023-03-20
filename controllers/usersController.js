const { User } = require("../models");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// POST - Tokens
async function token(req, res) {
  if (req.body.email === "" || req.body.password === "") {
    res.json("Rellene todos los campos.");
  } else {
    const user = await User.findOne({ email: req.body.email })
      .populate("tweets")
      .populate("following")
      .populate("followers");
    if (!user) {
      res.json("El usuario  no  existe");
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.json("La pass es inválida");
    }
    try {
      const payload = { id: user.id };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      res.json({
        userName: user.username,
        userId: user.id,
        userToken: token,
        userImage: user.image,
        userFirstName: user.firstname,
        userLastName: user.lastname,
        userDescription: user.description,
        userFollowers: user.followers,
        userFollowing: user.following,
        userTweets: user.tweets,
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }
}

// POST- Usuario en la DB
async function store(req, res) {
  const form = formidable({
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
    multiples: true,
  });
  form.parse(req, async (err, fields, files) => {
    const users = await User.find();
    if (
      fields.username === "" ||
      fields.email === "" ||
      fields.password === "" ||
      fields.firstname === ""
    ) {
      res.status(404).json("Rellena todos los campos.");
    } else {
      const unavailableUser = users.some(
        (u) => u.username === fields.username || u.email === fields.email
      );
      if (unavailableUser) {
        res.status(404).json("El usuario ya existe.");
      } else {
        await User.create({
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          username: fields.username,
          image: files.image.newFilename,
          password: fields.password,
        });
        res.status(201).json("Todo OK");
      }
    }
  });
}

// PATCH - User
async function edit(req, res) {
  const form = formidable({
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
    multiples: true,
  });
  form.parse(req, async (err, fields, files) => {
    console.log(files.banner);
    if (files.banner) {
      await User.findByIdAndUpdate(req.auth.id, {
        firstname: fields.firstname,
        lastname: fields.lastname,
        username: fields.username,
        banner: files.banner.newFilename,
        description: fields.description,
      });
    } else {
      await User.findByIdAndUpdate(req.auth.id, {
        firstname: fields.firstname,
        lastname: fields.lastname,
        username: fields.username,
        description: fields.description,
      });
    }
    res.status(200).json("Todo OK");
  });
}

// PATCH - Banner en User
async function bannerEdit(req, res) {
  await User.findByIdAndUpdate(req.user.id, {
    banner: req.body.banner,
  });
  res.status(200).json("Todo OK");
}

// PATCH - Follow
async function follow(req, res) {
  const userId = req.auth.id;
  const follow = req.params.id;
  await User.findByIdAndUpdate(userId, {
    $push: { following: follow },
  });
  await User.findByIdAndUpdate(follow, {
    $push: { followers: userId },
  });
  res.status(201).json("Todo OK");
}

// PATCH - Unfollow
async function unfollow(req, res) {
  await User.findByIdAndUpdate(req.auth.id, {
    $pull: { following: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.auth.id },
  });
  res.status(201).json("Todo OK");
}

// GET - Usuario
async function show(req, res) {
  const userProfile = await User.findOne({
    username: req.params.username,
  }).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  return res.json({
    userProfile,
  });
}

// GET - Followers de Usuario
async function followers(req, res) {
  const userParamsFollowers = await User.findOne({
    username: req.params.username,
  });
  const followers = userParamsFollowers.followers;
  const usersFollowers = await User.find({ _id: { $in: followers } });
  return res.json({ usersFollowers, userParamsFollowers });
}

// GET - Following de Usuario
async function following(req, res) {
  const userParamsFollowing = await User.findOne({
    username: req.params.username,
  });
  const followings = userParamsFollowing.following;
  const usersFollowing = await User.find({ _id: { $in: followings } });
  return res.json({ usersFollowing, userParamsFollowing });
}

// GET - 4 RANDOM USERS
async function randomUser(req, res) {
  //const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]);
  const usersInfo = await User.aggregate([
    { $match: { _id: { $ne: mongoose.Types.ObjectId(req.auth.id) } } },
    { $sample: { size: 4 } },
  ]);

  return res.json(usersInfo);
}

// const userId = req.auth.id;
// const newArr = [];
// for (const user of usersInfo) {
//   if (String(user._id) !== userId  ) {
//     newArr.push(user);
//   }
// }
//  return res.json(newArr);

module.exports = {
  store,
  show,
  edit,
  followers,
  following,
  follow,
  unfollow,
  bannerEdit,
  token,
  randomUser,
};
