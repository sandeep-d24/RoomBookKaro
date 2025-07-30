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
  phone: {type: String},
  email: String,
  bookingID: String,
  hotelName: String,
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
  comment: {type:String},
  statusChangeTime:{type:Date},
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

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
