const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Unused', 'Used', 'Expired', 'Active', 'Inactive', 'Redeemed', 'Cancelled'], default: 'Active' }
});

// unused: chưa sử dụng, nhưng không chắc còn hoạt động
// used: đã sử dụng, không biết nó đã dùng vào việc gì
// expired: đã hết hạn
// active: đang hoạt động, có thể sử dụng
// inactive: không hoạt động/bị vô hiệu hóa
// redeemed: đã được đổi, đã nhận được sản phẩm, có biết nó đã dùng vào việc gì
// cancelled: mã đã bị hủy

module.exports = mongoose.model('Voucher', VoucherSchema);
