const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("./models")
const bcrypt = require("bcryptjs")

module.exports = (app) => {
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (username, password, done) {
        try {
          const user = await User.findOne({ email: username });
          if (!user) {
            console.log("El usuario  no  existe");
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            console.log("La pass es inválida");
            return done(null, false, { message: "Credenciales incorrectas" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

};
