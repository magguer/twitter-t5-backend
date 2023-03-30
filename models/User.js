const { Schema, mongoose } = require("../db");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");


const userSchema = new Schema(
  {
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
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
      /*  required: [true, "Inserte una imagen."], */
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
      type: String
    },
    verify: {
      type: Boolean
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

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id.toString();
  delete user.password;
  return user;
};

// Bcrypt - Password
userSchema.pre('save', async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 8)
    next();
  }
})

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



const User = mongoose.model("User", userSchema);
module.exports = User;
