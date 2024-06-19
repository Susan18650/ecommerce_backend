const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 0 },
  isDeleted: {
    type: Boolean,
    default: false
},
});

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
