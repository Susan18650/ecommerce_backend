const createCustomerMiddleware = (req, res, next) => {
    console.log("Create Customer Middleware");
    next();
  };
  
  const getAllCustomerMiddleware = (req, res, next) => {
    console.log("Get All Customers Middleware");
    next();
  };
  
  const getCustomerByIdMiddleware = (req, res, next) => {
    console.log("Get Detail Customer Middleware");
    next();
  };
  
  const updateCustomerMiddleware = (req, res, next) => {
    console.log("Update Customer Middleware");
    next();
  };
  
  const deleteCustomerMiddleware = (req, res, next) => {
    console.log("Delete Customer Middleware");
    next();
  };
  
  module.exports = {
    createCustomerMiddleware,
    getAllCustomerMiddleware,
    getCustomerByIdMiddleware,
    updateCustomerMiddleware,
    deleteCustomerMiddleware,
  };
  