const createOrderMiddleware = (req, res, next) => {
    console.log("Create Order Middleware");
    next();
  };
  
  const getAllOrdersMiddleware = (req, res, next) => {
    console.log("Get All Orders Middleware");
    next();
  };
  
  const getAllOrdersOfCustomerMiddleware = (req, res, next) => {
    console.log("Get All Orders Middleware");
    next();
  };
  
  const getOrderByIdMiddleware = (req, res, next) => {
    console.log("Get Detail Order Middleware");
    next();
  };
  
  const updateOrderMiddleware = (req, res, next) => {
    console.log("Update Order Middleware");
    next();
  };
  
  const deleteOrderMiddleware = (req, res, next) => {
    console.log("Delete Order Middleware");
    next();
  };
  
  module.exports = {
    createOrderMiddleware,
    getAllOrdersMiddleware,
    getAllOrdersOfCustomerMiddleware,
    getOrderByIdMiddleware,
    updateOrderMiddleware,
    deleteOrderMiddleware,
  };
  