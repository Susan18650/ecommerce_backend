const express = require("express");
const router = express.Router();
const customerMiddleware = require("../middlewares/customer.middleware");
const customerController = require("../controllers/customer.controller");

router.post("/customers", customerMiddleware.createCustomerMiddleware, customerController.createCustomer);

router.post("/users/:userId/customers", customerController.createCustomerOfUser);


router.get("/customers", (req, res, next) => {
    const { email, phonenumber } = req.query;
    if (email && phonenumber) {
        customerController.getCustomerByEmailAndPhoneNumber(req, res, next);
    }
    else if (phonenumber) {
        customerController.getCustomerByPhoneNumber(req, res, next);
    } else if (email) {
        customerController.getCustomerByEmail(req, res, next);
    }
    else {
        customerController.getAllCustomer(req, res, next);
    }
});


router.get("/customers/:customerid", customerMiddleware.getCustomerByIdMiddleware, customerController.getCustomerById);
router.put("/customers/:customerid", customerMiddleware.updateCustomerMiddleware, customerController.updateCustomerById);
router.delete("/customers/:customerid", customerMiddleware.deleteCustomerMiddleware, customerController.deleteCustomerById);

module.exports = router;
