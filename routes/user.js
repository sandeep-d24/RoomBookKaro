const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");

// const app= express();

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



// app.get("/login", (req, res) => {
//   const fromBooking = req.query.fromBooking === 'true';
//   const listingId = req.query.listingId || null;
//   res.render("users/login", { fromBooking, listingId });
// });


// app.post("/login", async (req, res) => {
//   const { email, password, fromBooking, listingId } = req.body;

//   // Authenticate user here (assuming user is found)
//   const user = await User.findOne({ email });

//   if (user && user.password === password) {
//     req.session.user_id = user._id;

//     // Store booking modal flag in session
//     if (fromBooking && listingId) {
//       req.session.showBookingModal = true;
//       req.session.modalListingId = listingId;
//     }

//     res.redirect(`/listings/${listingId || ''}`);
//   } else {
//     res.redirect("/login");
//   }
// });


module.exports= router;