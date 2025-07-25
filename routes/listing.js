const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, isAdmin } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
  .get(wrapAsync(listingController.index)) 
  .post(upload.single('listing[image]'), wrapAsync(listingController.createListing)); 


router.get("/admin/list/add", listingController.renderNewForm); 


router.get("/new", listingController.renderNewForm); 


router.route("/:id")
  .get(wrapAsync(listingController.showListing)) 
  .put(isLoggedIn, isOwner, isAdmin, upload.single('listing[image]'), wrapAsync(listingController.updateListing)) 
  .delete(isLoggedIn, isOwner, isAdmin, wrapAsync(listingController.destroyListing)); 


router.get("/:id/edit", isLoggedIn, isOwner, isAdmin, wrapAsync(listingController.renderEditForm));


router.post("/:id/booking", isLoggedIn, isOwner); 


const isAdminRoute = (req) => req.originalUrl.startsWith('/admin');

router.put('/listings/:id', async (req, res, next) => {
  if (!isAdminRoute(req) && !req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(isAdminRoute(req) ? '/admin/listings' : `/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
