const bcrypt = require("bcryptjs");
const { User } = require("../models");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");

//  Crear usuario en la DB
async function createUser(req, res) {
  /*  const form = formidable({
     uploadDir: __dirname + "/../public/img",
     keepExtensions: true,
   });
   form.parse(req, async (err, fields, files) => {
     const users = await User.find();
     if (
       fields.username === "" ||
       fields.email === "" ||
       fields.password === "" ||
       fields.firstname === ""
     ) {
       req.flash("text", "Rellena todos los campos.");
       res.redirect("back");
     } else {
       const unavailableUser = users.some(
         (u) => u.username === fields.username || u.email === fields.email
       );
       if (unavailableUser) {
         req.flash("text", "El usuario ya existe.");
         res.redirect("back");
       } else {
         await User.create({
           firstname: fields.firstname,
           lastname: fields.lastname,
           email: fields.email,
           username: fields.username,
           image: files.image.newFilename,
           password: fields.password,
         });
       }
     
     }
   }); */
  const user = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    /* image: req.image.newFilename, */
    password: req.body.password,
  });
  res.json(user)
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
    res.json({ user: user.username, userId: user.id, token });
  } catch (e) {
    res.status(400).send(e);
  }
}

module.exports = {
  token,
  createUser,
};
