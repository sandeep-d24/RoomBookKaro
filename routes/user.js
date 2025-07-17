const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");

const userController= require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), userController.login);

//router.get("/signup", userController.renderSignupForm
//);

//router.post("/signup", wrapAsync(userController.signup)
//);

//router.get("/login", userController.renderLoginForm
//);

//router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), userController.login
//);

router.get("/logout", userController.logout
);

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users,"users")
    res.render('admin/users', { users });  // Rendering 'users.ejs'
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

module.exports= router;