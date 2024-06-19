const Voucher = require('../models/voucher.model');
const crypto = require('crypto');
const schedule = require('node-schedule');

const createVoucher = async (req, res) => {
  const { discount, startDate, endDate } = req.body;

  // Check if discount is a number
  if (isNaN(discount) || discount < 0) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Discount must be a number and must be a non-negative number",
    });
  }

  // Check if startDate is before endDate
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      status: "Error",
      message: "StartDate must be before endDate!"
    });
  }

  // Check if endDate is in the future
  if (new Date(endDate) <= new Date()) {
    return res.status(400).json({
      status: "Error",
      message: "EndDate must be in the future!"
    });
  }

  // Check if startDate and endDate are in the correct format
  const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/; // YYYY-MM-DD
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({
      status: "Bad Request",
      message: "StartDate and SndDate must be in the format YYYY-MM-DD",
    });
  }

  // Check if startDate and endDate are valid dates
  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      status: "Bad Request",
      message: "StartDate and EndDate must be valid dates",
    });
  }

  // Generate a random 8-character code
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();

  const newVoucher = new Voucher({
    code,
    discount,
    startDate,
    endDate,
    status: 'Active'
  });

  try {
    const savedVoucher = await newVoucher.save();
    return res.status(200).json({
      status: "Create voucher successfully!",
      data: savedVoucher
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    return res.status(200).json({
      status: "Get voucher successfully!",
      data: vouchers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) throw Error("No voucher found");
    return res.status(200).json({
      status: "Delete voucher successfully!",
      data: deletedVoucher
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// check voucher fuction
const checkVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code });
    if (!voucher) throw Error("No voucher found");
    if (voucher.status === 'Active') {
      return res.status(200).json({
        status: "Voucher is active and ready to use!",
        data: voucher
      });
    } else {
      return res.status(400).json({
        status: "Voucher is not active!",
        data: voucher
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateVoucherStatuses = async () => {
  // Find all vouchers with status 'Active'
  const vouchers = await Voucher.find({ status: 'Active' });

  vouchers.forEach(voucher => {
    // Schedule a job to update the status of the voucher at its endDate
    schedule.scheduleJob(voucher.endDate, async () => {
      voucher.status = 'Expired';
      await voucher.save();
    });
  });
};

// Call the function once when the server starts
updateVoucherStatuses();

const useVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code });
    if (!voucher) throw Error("No voucher found");

    // Kiểm tra xem startDate có ở tương lai hay không
    if (new Date(voucher.startDate) > new Date()) {
      return res.status(400).json({
        status: "Error",
        message: "Voucher cannot be used until its start date!"
      });
    }

    if (voucher.status !== 'Active') {
      return res.status(400).json({
        status: "Error",
        message: "Voucher is not active or has already been redeemed!"
      });
    }

    // Update the voucher status to 'Redeemed'
    voucher.status = 'Redeemed';
    await voucher.save();

    return res.status(200).json({
      status: "Voucher has been successfully redeemed!",
      data: voucher
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createVoucher,
  getAllVouchers,
  deleteVoucher,
  checkVoucher,
  useVoucher
};
