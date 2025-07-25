const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/listing');

router.post('/bookings', async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    const user = req.user;

    const booking = new Booking({
      listing: listing._id,
      userId: user?._id || null,

      name: user?.name || 'Guest',
      Phone: user?.phone || 'Unknown',
      email: user?.email || 'Unknown',

      bookingID: `BK-${Date.now()}`,
      hotelName: listing.title || 'Hotel',

      bookingStartDate: startDate,
      bookingEndDate: endDate,

      startDate,
      endDate
    });

    await booking.save();
    req.flash("success", "Booking Successful");
    res.redirect('/listings');
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
