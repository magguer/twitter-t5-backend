const { Schema, mongoose } = require("../db");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Inserte un nombre."],
    },
    lastname: {
      type: String,
      required: [true, "Inserte un apellido."],
    },
    username: {
      type: String,
      required: [true, "Inserte un username."],
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Inserte una imagen."],
    },
    banner: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Inserte un nickname."],
    },
    email: {
      type: String,
      required: [true, "Inserte un email."],
      unique: true,
    },
    description: {
      type: String,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    //Validaciones en general TO DO
  },
  { timestamps: true }
);

// Slugify para el username y el email

userSchema.pre('save', async function (next) {
  // Expresion regular creada
  this.username = this.username.replace(/[$%]/gi, "")
  this.username = slugify(this.username, {
    replacement: '-',
    trim: true,
    lower: true,
    strict: false,

  })
  next();
})



// Método para Slagify los usernames

const User = mongoose.model("User", userSchema);

module.exports = User;
