const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware'); 

router.post('/bookings', isLoggedIn, async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    const booking = new Booking({
      listing: listingId,
      userId: req.user._id, 
      startDate,
      endDate,
    });

    await booking.save();
    req.flash("success", "Booking Successful");
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
