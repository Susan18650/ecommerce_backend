const express = require('express');
const router = express.Router();

const voucherController = require("../controllers/voucher.controller");
const voucherMiddleware = require("../middlewares/voucher.middleware");

const userMiddleWare = require("../middlewares/user.middleware")

router.get('/voucher', voucherController.getAllVouchers, voucherMiddleware.getAllVoucherMiddleware);
router.get('/voucher/:code', voucherController.checkVoucher)
router.post('/voucher/use/:code', voucherController.useVoucher);
router.post('/voucher', [userMiddleWare.verifyToken, userMiddleWare.checkUser], voucherController.createVoucher, voucherMiddleware.createVoucherMiddleware);
router.delete('/voucher/:id', [userMiddleWare.verifyToken, userMiddleWare.checkUser], voucherController.deleteVoucher, voucherMiddleware.deleteVoucherMiddleware);

module.exports = router;