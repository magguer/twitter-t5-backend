require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");
const express = require("express");
const flash = require('express-flash');

const sessions = require("./sessions");
const routes = require("./routes");
const passport = require("./passport");

const APP_PORT = process.env.APP_PORT || 8000;
const app = express();


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


sessions(app);
passport(app);
routes(app);

app.use(flash());
/* app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});
 */
app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});

// Esto se ejecuta cuando se "apaga" la app.
process.on("SIGINT", function () {
  const { mongoose } = require("./db");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection is disconnected due to application termination.\n");
    process.exit(0);
  });
});
