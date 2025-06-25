const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
//const {listingSchema,reviewSchema}= require("../schema.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}= require("../middleware.js");

const reviewController= require("../controllers/reviews.js");

// const validateReview=(req,res,next)=>{
//     let {error}= reviewSchema.validate(req.body);
//     console.log(result);
//     if(error){
//         throw new ExpressError(400,result.error);
//     } else{
//         next();
//     }
// };

//Reviews
//Post Review Route
router.post("/",isLoggedIn, wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview)
);

module.exports= router;