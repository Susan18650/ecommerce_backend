const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippedDate: {
    type: Date,
    default: Date.now,
  },
  orderCreatedDate: {
    type: Date,
    default: Date.now
  },
  voucher: {
    type: Schema.Types.ObjectId,
    ref: "Voucher",
  },
  note: String,
  orderDetails: [{
    type: Schema.Types.ObjectId,
    ref: "OrderDetail",
  }],
  cost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  isDeleted: {
    type: Boolean,
    default: false
},
});

module.exports = mongoose.model("Order", orderSchema);
