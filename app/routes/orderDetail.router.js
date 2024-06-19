const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetail.controller');
const orderDetailMiddleware = require('../middlewares/orderDetail.middleware');

router.post('/order/:orderId/orderDetail', orderDetailController.createOrderDetailOfOrder, orderDetailMiddleware.createOrderDetailOfOrderMiddleware);
router.get('/order/:orderId/orderDetail', orderDetailController.getAllOrderDetailOfOrder, orderDetailMiddleware.getAllOrderDetailOfOrderMiddleware);
router.get('/orderDetail/:orderDetailId', orderDetailController.getOrderDetailById, orderDetailMiddleware.getOrderDetailByIdMiddleware);
router.put('/orderDetail/:orderDetailId', orderDetailController.updateOrderDetail, orderDetailMiddleware.updateOrderDetailMiddleware);
router.delete('/orderDetail/:orderDetailId', orderDetailController.deleteOrderDetail, orderDetailMiddleware.deleteOrderDetailMiddleware);

module.exports = router;
