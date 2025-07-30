const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const User = require("../models/user");

const { isAdminLoggedIn } = require("../middleware");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });






require("dotenv").config();

router.get("/admin", (req,res)=>{
    res.render("admin/login.ejs");
});

router.get("/admin/list/add", (req,res)=>{
    res.render("admin/addlist.ejs");
});
router.get("/admin/booking",async (req,res)=>{
    try {
const bookings = await Booking.aggregate([
{
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user"
  }
},
{
  $unwind: "$user"
},
{
  $lookup: {
    from: "listings",   // use lowercase collection name
    localField: "listing",
    foreignField: "_id",
    as: "listing"
  }
},
{
  $unwind: "$listing"
}
]);

  // console.log(bookings, "=====")
  res.render('admin/booking', { bookings });
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

// Admin dashboard listings
router.get("/admin/listings", isAdminLoggedIn, async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("admin/listings", { listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});

// Admin add listing form
router.get("/admin/list/add", isAdminLoggedIn, (req, res) => {
  res.render("admin/addlist.ejs");
});

// Admin create listing
router.post("/admin/listings", isAdminLoggedIn, upload.single("listing[image]"), async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Optional: associate with admin or leave null
    newListing.owner = null;

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/admin/listings");
  } catch (err) {
    console.error("Error creating admin listing:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/admin/list/add");
  }
});

// Admin edit listing form
router.get("/editlist/:id/admin_edit", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  res.render("admin/admin_edit", { listing });
});

// Admin update listing
router.put("/admin/listings/:id", isAdminLoggedIn, upload.single("listing[image]"), async (req, res) => {
  const { id } = req.params;
  const newListing = req.body.listing;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await Listing.findByIdAndUpdate(id, newListing);
  req.flash("success", "Listing updated successfully!");
  res.redirect("/admin/listings");
});

// Admin delete listing
router.delete("/admin/listings/:id", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }

    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin show listing details
router.get("/showlist/:id/admin_show", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate("owner");

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("admin/admin_show", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin booking view
router.post("/admin/bookings/:id", isAdminLoggedIn, async (req, res) => {
  try {
    console.log("id", req.params.id)

const bId = req.params.id
     const updateBooking= await Booking.findOneAndUpdate({_id:bId},req.body)
     console.log(updateBooking, "true")

    res.redirect("/admin/booking");
  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).send("Error fetching bookings");
  }
});

// Example: protected bookings dashboard (not used if /admin/booking above is enough)
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/dashboard/bookings", isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.render("admin/bookings", { bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bookings");
  }
});

module.exports = router;
