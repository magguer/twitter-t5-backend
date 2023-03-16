const express = require("express");
const router = express.Router();
const { expressjwt: checkJwt } = require("express-jwt");
const tweetsController = require("../controllers/tweetsController");


router.use(checkJwt({ secret: "privateKey", algorithms: ["HS256"] }))

router.get("/", tweetsController.index);
router.post("/", tweetsController.store);
router.delete("/:id", tweetsController.destroy);

//Hacer Toggle de Likes
router.patch("/tweets/:id/", tweetsController.LikeTweet);
router.patch("/tweets/:id/", tweetsController.UnlikeTweet);


module.exports = router;
