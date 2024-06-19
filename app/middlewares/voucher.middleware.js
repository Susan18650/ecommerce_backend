const createVoucherMiddleware = (req, res, next) => {
    console.log("Create Voucher Middleware");
    next();
}

const getAllVoucherMiddleware = (req, res, next) => {
    console.log("Get All Voucher Middleware");
    next();
}

const deleteVoucherMiddleware = (req, res, next) => {
    console.log("Delete Voucher Middleware");
    next();
}

module.exports = {
    createVoucherMiddleware,
    getAllVoucherMiddleware,
    deleteVoucherMiddleware
}