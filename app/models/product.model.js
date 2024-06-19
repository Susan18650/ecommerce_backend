const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  category: [{
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }],
  imageUrls: [{
    type: String,
    required: true,
  }],
  buyPrice: {
    type: Number,
    required: true,
  },
  promotionPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  percentDiscount: {
    type: Number,
    required: false,
  },
  productCreatedDate: {
    type: Date,
    default: Date.now
  },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
