const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Create this model
const Listing = require('../models/listing'); // Assuming you already have this

router.post('/bookings', async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    const booking = new Booking({
      listing: listingId,
      startDate,
      endDate
    });

    await booking.save();
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
