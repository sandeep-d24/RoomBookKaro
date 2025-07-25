const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  phone: String,
  email: String,
  bookingID: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['New', 'Confirmed', 'Rejected'],
    default: 'New'
  },
  comment: String,
  statusChangeTime: Date,
  checkinStatus: {
    type: String,
    enum: ['Pending', 'CheckedIn', 'NoShow'],
    default: 'Pending'
  },
  checkinComment: String,
  checkinTime: Date,
  checkoutTime: Date,
  checkoutComment: String
});

module.exports = mongoose.model('Booking', bookingSchema);
