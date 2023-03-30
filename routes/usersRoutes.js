const express = require("express");
const router = express.Router();
const { expressjwt: checkJwt } = require("express-jwt");
const usersController = require("../controllers/usersController");

router.post("/users", usersController.store);
router.post("/tokens", usersController.token);

/* router.use(checkJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] })); */

router.get("/random", usersController.randomUser);
router.get("/:username", usersController.show);
router.get("/:username/followers", usersController.followers);
router.get("/:username/following", usersController.following);
router.patch("/:username", usersController.edit)

// Hacer Toggle de Follow
router.patch("/:id/follow", usersController.follow);
router.patch("/:id/unfollow", usersController.unfollow);

module.exports = router;
