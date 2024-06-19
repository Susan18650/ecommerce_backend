const express = require("express");
const router = express.Router();

const productMiddleware = require("../middlewares/product.middleware");
const productController = require("../controllers/product.controller");

const userMiddleWare = require("../middlewares/user.middleware")

router.post("/product", [userMiddleWare.verifyToken, userMiddleWare.checkUser], productMiddleware.createProductMiddleware, productController.createProduct);
router.get("/product", productMiddleware.getAllProductMiddleware, (req, res, next) => {
    const { name, category, minPrice, maxPrice } = req.query;
    if (name || category || minPrice || maxPrice) {
        productController.getProducts(req, res, next);
    } else {
        productController.getAllProduct(req, res, next);
    }
});

router.get("/product/:productid", productMiddleware.getProductByIdMiddleware, productController.getProductById);
router.put("/product/:productid", [userMiddleWare.verifyToken, userMiddleWare.checkUser], productMiddleware.updateProductMiddleware, productController.updateProductById);
router.delete("/product/:productid", [userMiddleWare.verifyToken, userMiddleWare.checkUser], productMiddleware.deleteProductMiddleware, productController.deleteProductById);

module.exports = router;