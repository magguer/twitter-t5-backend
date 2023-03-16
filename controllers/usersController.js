const { User } = require("../models");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");


// POST - Tokens
async function token(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json("El usuario  no  existe");
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    res.json("La pass es inválida");
  }
  try {
    const payload = { id: user.id };
    const secret = "privateKey";
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.json({
      userName: user.username,
      userId: user.id,
      token,
      userImage: user.image,
      userFirstName: user.firstname,
      userLastName: user.lastname
    });
  } catch (e) {
    res.status(400).send(e);
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
      res.status(404).json("Rellena todos los campos.")
    } else {
      const unavailableUser = users.some(
        (u) => u.username === fields.username || u.email === fields.email
      );
      if (unavailableUser) {
        res.status(404).json("El usuario ya existe.")
      } else {
        await User.create({
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          username: fields.username,
          image: files.image.newFilename,
          password: fields.password,
        });
        res.status(201).json("Todo OK")
      }
    }
  });
}

// PATCH - Banner en User
async function bannerEdit(req, res) {
  await User.findByIdAndUpdate(req.user.id, {
    banner: req.body.banner,
  });
  res.status(200).json("Todo OK")
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
  res.status(201).json("Todo OK")
}

// PATCH - Unfollow
async function unfollow(req, res) {
  await User.findByIdAndUpdate(req.auth.id, {
    $pull: { following: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.auth.id },
  });
  res.status(201).json("Todo OK")
}

// GET - Usuario 
async function show(req, res) {
  const userProfile = await User.findOne({
    username: req.params.username,
  }).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  //const userTweets = await User.findById(req.user.id).populate({ path: "tweets", options: { sort: { createdAt: -1 } } });
  return res.json({
    userProfile,
  });
}

// GET - Followers de Usuario
async function followers(req, res) {
  /*   const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
  const userParamsFollowers = await User.findOne({ username: req.params.username });
  const followers = userParamsFollowers.followers;
  const usersFollowers = await User.find({ _id: { $in: followers } });
  return res.json({ usersFollowers, userParamsFollowers/* , usersInfo */ });
}

// GET - Following de Usuario
async function following(req, res) {
  /*  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
  const userParamsFollowing = await User.findOne({ username: req.params.username });
  const followings = userParamsFollowing.following;
  const usersFollowing = await User.find({ _id: { $in: followings } });
  return res.json({ usersFollowing, userParamsFollowing/* , usersInfo */ });
}


module.exports = {
  followers,
  following,
  follow,
  unfollow,
  show,
  bannerEdit,
  store,
  token
};