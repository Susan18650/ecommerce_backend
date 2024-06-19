const express = require("express");
const router = express.Router();

const categoryMiddleware = require("../middlewares/category.middleware");
const categoryController = require("../controllers/category.controller");

const userMiddleWare = require("../middlewares/user.middleware")

router.get("/category", (req, res, next) => {
    if (req.query.name) {
        categoryController.getCategoryByName(req, res, next);
    } else {
        categoryController.getAllCategory(req, res, next);
    }
});

router.get("/category/:categoryid", categoryMiddleware.getCategoryByIDMiddleware, categoryController.getCategoryById);
router.post("/category", [userMiddleWare.verifyToken, userMiddleWare.checkUser], categoryMiddleware.createCategoryMiddleware, categoryController.createCategory);
router.put("/category/:categoryid", [userMiddleWare.verifyToken, userMiddleWare.checkUser], categoryMiddleware.updateCategoryMiddleware, categoryController.updateCategoryById);
router.delete("/category/:categoryid", [userMiddleWare.verifyToken, userMiddleWare.checkUser], categoryMiddleware.deleteCategoryMiddleware, categoryController.deleteCategoryById);


module.exports = router;