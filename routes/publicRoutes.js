const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { expressjwt: checkJwt } = require("express-jwt")

router.get("/", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), pagesController.showHome);


router.get("*", function (req, res) {
  res.status(404).render("pages/404");
});

module.exports = router;
