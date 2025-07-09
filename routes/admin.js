const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const passport= require("passport");

require("dotenv").config();

router.get("/admin", (req,res)=>{
    res.render("admin/login.ejs");
});

// router.post("/admin", passport.authenticate("local", {failureRedirect: '/admin', failureFlash: true,}), async(req,res)=> {
//     req.flash("Welcome to Admin Dashboard!");
//     res.render("admin/dashboard.ejs");
// });

router.post("/admin", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.render("admin/dashboard.ejs");
  } else {
    return res.status(401).send("Unauthorized: Invalid admin credentials");
  }
});

module.exports= router;

