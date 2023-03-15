const bcrypt = require("bcryptjs");
const { User } = require("../models");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");

//  Crear usuario en la DB
async function createUser(req, res) {
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
      userLastName: user.lastname,
      userFollowers: user.followers,
      userFollowings: user.following
    });
  } catch (e) {
    res.status(400).send(e);
  }
}

module.exports = {
  token,
  createUser,
};
