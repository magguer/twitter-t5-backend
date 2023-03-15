const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tweetsController = require("../controllers/tweetsController");
const { expressjwt: checkJwt } = require("express-jwt");

// REST API, para los usuarios

router.get("/:username", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), userController.profile);
router.get("/:username/followers", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), userController.followers);
router.get("/:username/following", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), userController.following);

router.post("/user", userController.store);
router.post("/token", userController.token);

router.put("/:id/follow", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), userController.follow);
router.put("/:id/unfollow", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), userController.unfollow);
router.put("/banner", userController.bannerEdit);
router.put("/", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), tweetsController.newTweet);
router.delete("/:id", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), tweetsController.deleteTweet);
router.put("/tweets/:id/", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), tweetsController.addLikeTweet);
router.delete("/tweets/:id/", checkJwt({ secret: "privateKey", algorithms: ["HS256"] }), tweetsController.removeLikeTweet);

module.exports = router;
