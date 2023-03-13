const passport = require("passport");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const formidable = require("formidable");


async function register(req, res) {
    res.render("users/register")
}

// Login Page.
async function login(req, res) {
    res.render("users/login")
}

// Display a listing of the resource.
async function logout(req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/login");
    });
}

//  Crear usuario en la DB
function createUser(req, res) {
    const form = formidable({
        uploadDir: __dirname + "/../public/img",
        keepExtensions: true,
    });
    form.parse(req, async (err, fields, files) => {
        const users = await User.find()
        if (fields.username === "" || fields.email === "" || fields.password === "" || fields.firstname === "") {
            req.flash('text', 'Rellena todos los campos.');
            res.redirect("back")
        } else {
            const unavailableUser = users.some((u) => u.username === fields.username || u.email === fields.email)
            if (unavailableUser) {
                req.flash('text', 'El usuario ya existe.');
                res.redirect("back")
            } else {
                await User.create({
                    firstname: fields.firstname,
                    lastname: fields.lastname,
                    email: fields.email,
                    username: fields.username,
                    image: files.image.newFilename,
                    password: await bcrypt.hash(fields.password, 8)
                })
                /* user.save() */
                return res.redirect("/");
            }
        }
    })
}

const loginPassport = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
});


module.exports = {
    register,
    login,
    logout,
    loginPassport,
    createUser,
};