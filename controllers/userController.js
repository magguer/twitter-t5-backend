const { User } = require("../models");
const { format, formatDistance } = require("date-fns");
const { en } = require("date-fns/locale");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");

/* Página Followers */
async function followers(req, res) {
  /*   const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
  const userParamsFollowers = await User.findOne({ username: req.params.username });
  const followers = userParamsFollowers.followers;
  const usersFollowers = await User.find({ _id: { $in: followers } });
  return res.json({ usersFollowers, userParamsFollowers/* , usersInfo */ });
}

/* Página Following */
async function following(req, res) {
  /*  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
  const userParamsFollowing = await User.findOne({ username: req.params.username });
  const followings = userParamsFollowing.following;
  const usersFollowing = await User.find({ _id: { $in: followings } });
  return res.json({ usersFollowing, userParamsFollowing/* , usersInfo */ });
}

/*  Perfil de Usuario */
async function profile(req, res) {
  /*  const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
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

/* Función Unfollow */
async function unfollow(req, res) {
  await User.findByIdAndUpdate(req.auth.id, {
    $pull: { following: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.auth.id },
  });
  res.status(201).json("Todo OK")
}

//  Crear usuario en la DB
async function store(req, res) {  //Deberia ser store
  const form = formidable({
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
    multiples: true,
  });
  form.parse(req, async (err, fields, files) => {
    //console.log("Estos son los fields:", fields);
    //console.log("Estos son los files:", files);
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

async function token(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("El usuario  no  existe");
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    console.log("La pass es inválida");
  }
  try {
    const payload = { id: user.id };
    const secret = "privateKey";
    const token = jwt.sign(payload, secret);
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


module.exports = {
  followers,
  following,
  follow,
  unfollow,
  profile,
  bannerEdit,
  store,
  token
};
