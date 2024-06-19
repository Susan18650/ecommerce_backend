const createCategoryMiddleware = (req, res, next) => {
    console.log("Create Category Middleware");
    next();
}

const getAllCategoryMiddleware = (req, res, next) => {
    console.log("Get All Category Middleware");
    next();
}

const getCategoryByIDMiddleware = (req, res, next) => {
    console.log("Get Detail Category Middleware");
    next();
}

const updateCategoryMiddleware = (req, res, next) => {
    console.log("Update Category Middleware");
    next();
}

const deleteCategoryMiddleware = (req, res, next) => {
    console.log("Delete Category Middleware");
    next();
}

module.exports = {
    createCategoryMiddleware,
    getAllCategoryMiddleware,
    getCategoryByIDMiddleware,
    updateCategoryMiddleware,
    deleteCategoryMiddleware
}