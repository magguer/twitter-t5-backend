const { Tweet, User } = require("../models");

// GET - Tweets
async function index(req, res) {
    /*     const usersInfo = await User.aggregate([{ $sample: { size: 4 } }]); */
    const user = await User.findById(req.auth.id);
    const tweets = await Tweet.find({ user: { $in: [user, ...user.following] } })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("likes");

    /*  const allUsersTweets = [];
     const allTweets = []; */
    /*  const user = await User.findById(req.auth.id).populate({
         path: "tweets",
         options: { sort: { createdAt: -1 } },
     });
     const myTweets = user.tweets;
     allUsersTweets.push(...myTweets);
 
     for (const newuser of users) {
         const tweets = newuser.tweets;
         allUsersTweets.push(...tweets);
     }
 
     for (const tweet of allUsersTweets) {
         const tweetsWithUser = await Tweet.find(tweet._id)
             .populate({ path: "user", options: { sort: { createdAt: -1 } } })
             .populate("likes");
         allTweets.push(...tweetsWithUser);
     }
  */

    return res.json({
        tweets
    });
}

// POST - Tweet
async function store(req, res) {
    const newTweet = new Tweet({
        user: req.user.id,
        text: req.body.newTweet,
    });
    newTweet.save();
    await User.findByIdAndUpdate(req.user.id,
        { $push: { tweets: newTweet } }
    );
    return res.redirect("/");
}

// DELETE - Tweet
async function destroy(req, res) {
    await Tweet.findByIdAndDelete(req.params.id)
    await User.findByIdAndUpdate(req.user.id,
        { $pull: { tweets: req.params.id } }
    );
    return res.redirect(`back`)
}

// PATCH - Like
async function LikeTweet(req, res) {
    const tweetId = req.params.id
    const userId = req.user.id
    await Tweet.findByIdAndUpdate(tweetId,
        {
            $push: { likes: userId }
        }/*        {
            new: true
        } */)
    return res.redirect("back")
}

// PATCH - Unlike
async function UnlikeTweet(req, res) {
    const tweetId = req.params.id
    const userId = req.user.id
    await Tweet.findByIdAndUpdate(tweetId,
        {
            $pull: { likes: userId }
        }/* , {
        new: true
    } */)
    return res.redirect("back")
}


module.exports = {
    index,
    store,
    destroy,
    LikeTweet,
    UnlikeTweet
};
