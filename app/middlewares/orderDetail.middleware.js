const createOrderDetailOfOrderMiddleware = (req, res, next) => {
    console.log("Create Order Detail Middleware");
    next();
  };
  
  const getAllOrderDetailOfOrderMiddleware = (req, res, next) => {
    console.log("Get All Orders Detail Middleware");
    next();
  };
  
  const getOrderDetailByIdMiddleware = (req, res, next) => {
    console.log("Get All Orders Detail Middleware");
    next();
  };
  
  const updateOrderDetailMiddleware = (req, res, next) => {
    console.log("Get Detail Order Detail Middleware");
    next();
  };
  
  const deleteOrderDetailMiddleware = (req, res, next) => {
    console.log("Update Order Detail Middleware");
    next();
  };
  
  module.exports = {
    createOrderDetailOfOrderMiddleware,
    getAllOrderDetailOfOrderMiddleware,
    getOrderDetailByIdMiddleware,
    updateOrderDetailMiddleware,
    updateOrderDetailMiddleware,
    deleteOrderDetailMiddleware,
  };
  