const Listing = require("./models/listing");
const Review = require("./models/review");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL in locals for use after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware to check if the current user owns the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!listing.owner?.equals(res.locals.currUser?._id)) {
    req.flash("error", "You are not the owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Middleware to check if the current user wrote the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author?.equals(res.locals.currUser?._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Admin middleware (used with passport-authenticated user-based admin)
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user?.isAdmin) {
    return next();
  }
  req.flash("error", "Admin access required.");
  return res.redirect("/listings");
};

// Admin middleware for session-based admin login
module.exports.isAdminLoggedIn = (req, res, next) => {
  if (req.session?.isAdmin) {
    return next();
  }
  req.flash("error", "Admin login required.");
  return res.redirect("/admin/listings"); 
};
