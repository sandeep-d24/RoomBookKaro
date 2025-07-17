const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
//const {listingSchema,reviewSchema}= require("../schema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isOwner}= require("../middleware.js");
const listingController= require("../controllers/listings.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });


// const validateListing=(req,res,next)=>{
//     let {error}= listingSchema.validate(req.body);
//     console.log(result);
//     if(error){
//         throw new ExpressError(400,result.error);
//     } else{
//         next();
//     }
// };

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm
);

//Booking Login Route
//router.get("/show", isLoggedIn, listingController.renderNewForm
// );

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//Index Route
//router.get("/", wrapAsync(listingController.index)
//);


//Show Route
//router.get("/:id",wrapAsync(listingController.showListing)
//);

//Create Route
//router.post("/",isLoggedIn,wrapAsync(listingController.createListing)
//);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);


router.post("/:id/booking",isLoggedIn,isOwner);
//Update Route
//router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing)
//);

//Delete Route
//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)
//);

// app.get('/listings/:id/booking', async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     return res.status(404).send('Listing not found');
//   }
//   res.render('bookings/new', { listing });
// });


module.exports= router;
