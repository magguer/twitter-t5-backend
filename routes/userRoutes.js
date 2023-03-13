const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tweetsController = require("../controllers/tweetsController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Rutas relacionadas a Profile, Followers, Following

// Hay que agregarle el /:user a las rutas NO OLVIDAR

router.use(isAuthenticated);

// Páginas
router.get("/:username", userController.profile);
router.get("/:username/followers", userController.followers);
router.get("/:username/following", userController.following);



// Acciones
router.put("/:id/follow", userController.follow)
router.put("/:id/unfollow", userController.unfollow)
router.put("/banner", userController.bannerEdit)
router.put("/", tweetsController.newTweet);
router.delete("/:id", tweetsController.deleteTweet);
router.put("/tweets/:id/add", tweetsController.addLikeTweet);
router.put("/tweets/:id/remove", tweetsController.removeLikeTweet);


module.exports = router;
