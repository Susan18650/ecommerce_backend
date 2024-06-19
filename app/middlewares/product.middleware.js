const createProductMiddleware = (req, res, next) => {
    console.log("Create Product Middleware");
    next();
  };
  
  const getAllProductMiddleware = (req, res, next) => {
    console.log("Get All Product Middleware");
    next();
  };
  
  const getProductByIdMiddleware = (req, res, next) => {
    console.log("Get Detail Product Middleware");
    next();
  };
  
  const updateProductMiddleware = (req, res, next) => {
    console.log("Update Product Middleware");
    next();
  };
  
  const deleteProductMiddleware = (req, res, next) => {
    console.log("Delete Product Middleware");
    next();
  };
  
  module.exports = {
    createProductMiddleware,
    getAllProductMiddleware,
    getProductByIdMiddleware,
    updateProductMiddleware,
    deleteProductMiddleware,
  };
  