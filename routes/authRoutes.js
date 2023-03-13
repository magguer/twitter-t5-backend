const passport = require("passport");
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated")
const authController = require("../controllers/authController")

/**
 * Se sugiere usar este archivo para crear rutas relativas al proceso de
 * autenticación. Ejemplos: "/login" y "/logout".
 */

router.get("/register", authController.register);
router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.get("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
