const session = require("express-session");
const flash = require("express-flash");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: "twitter_session", // Por defecto la cookie se llama "connect.id"
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // Por defecto es null (la cookie no expira). Valor en milisegundos.
        secure: false, // La opción `true` requiere HTTPS.
        httpOnly: true,
      },
    }),
  );

  app.use(flash());
};
