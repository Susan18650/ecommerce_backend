const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const orderMiddleware = require('../middlewares/order.middleware')


router.post('/order/:customerId', orderController.createOrderOfCustomer, orderMiddleware.createOrderMiddleware);

router.get('/order', orderController.getAllOrder, orderMiddleware.getAllOrdersMiddleware);

router.get('/order/:customerId', orderController.getAllOrderOfCustomer, orderMiddleware.getAllOrdersOfCustomerMiddleware);

router.get('/orders/:orderId', orderController.getOrderById, orderMiddleware.getAllOrdersMiddleware);

router.put('/order/:orderId', orderController.updateOrder, orderMiddleware.updateOrderMiddleware);

router.delete('/order/:orderId', orderController.deleteOrder, orderMiddleware.deleteOrderMiddleware);

module.exports = router;
