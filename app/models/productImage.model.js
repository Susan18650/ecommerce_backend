const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductImageSchema = new Schema({
    img: { data: Buffer, contentType: String },
    name: String,
    // width: Number,
    // height: Number
});

module.exports = mongoose.model('productImage', ProductImageSchema);