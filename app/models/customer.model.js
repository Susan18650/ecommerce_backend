const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  ward: {
    type: String,
    require: false
},
  orders: [{
    type: Schema.Types.ObjectId,
    ref: "Order",
  }],
  isDeleted: {
    type: Boolean,
    default: false
},
});

module.exports = mongoose.model("Customer", customerSchema);
