const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const passport= require("passport");

const Listing = require('../models/listing');

require("dotenv").config();

router.get("/admin", (req,res)=>{
    res.render("admin/login.ejs");
});

router.get("/admin/list/add", (req,res)=>{
    res.render("admin/addlist.ejs");
});
router.get("/admin/booking",async (req,res)=>{
      try {
    const listings = await Listing.find({});
    res.render('admin/booking', { listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});


// Show all listings in admin dashboard
router.get('/admin/listings', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render('admin/listings', { listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
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

