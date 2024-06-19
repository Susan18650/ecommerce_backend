const mongoose = require("mongoose");
const orderDetailModel = require("../models/orderDetail.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");

const createOrderDetailOfOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order ID is not valid!",
      });
    }

    const { product, quantity } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Product ID is not valid!",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order not found",
      });
    }

    const productInfo = await productModel.findById(product);

    if (!productInfo) {
      return res.status(404).json({
        status: "Not Found",
        message: "Product not found",
      });
    }

    // Kiểm tra xem quantity có vượt quá amount không
    if (quantity > productInfo.amount) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Quantity exceeds the available amount of the product",
      });
    }

    // Cập nhật số lượng sản phẩm sau khi đặt hàng thành công
    productInfo.amount -= quantity;
    await productInfo.save();

    const newOrderDetail = {
      _id: new mongoose.Types.ObjectId(),
      product: product,
      quantity: quantity,
    };

    const result = await orderDetailModel.create(newOrderDetail);

    order.orderDetails.push(result._id);
    
    await order.save();

    return res.status(200).json({
      status: "Create order detail successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getAllOrderDetailOfOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order ID is not valid!",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order not found",
      });
    }

    const orderDetails = await orderDetailModel.find({ _id: { $in: order.orderDetails } }).populate('product');

    return res.status(200).json({
      status: "Get all order details of order successfully",
      data: orderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const orderDetailId = req.params.orderDetailId;

    // Validate orderDetailId
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order Detail ID is not valid!",
      });
    }

    const result = await orderDetailModel.findById(orderDetailId).populate('product');

    if (result) {
      return res.status(200).json({
        status: "Get order detail successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const updateOrderDetail = async (req, res) => {
  try {
    const orderDetailId = req.params.orderDetailId;
    const { quantity } = req.body;

    // Validate orderDetailId
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order Detail ID is not valid!",
      });
    }

    const orderDetail = await orderDetailModel.findById(orderDetailId).populate('product');

    if (!orderDetail) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order Detail not found",
      });
    }

    // Get the current quantity and product information
    const currentQuantity = orderDetail.quantity;
    const productInfo = await productModel.findById(orderDetail.product);

    // Adjust the product amount based on the difference in quantity
    const quantityDifference = quantity - currentQuantity;
    productInfo.amount -= quantityDifference; // Adjust the product amount inversely to the quantity change
    await productInfo.save();

    // Update order detail data
    orderDetail.quantity = quantity;

    // Calculate the change in cost for the updated order detail
    const costChange = quantityDifference * productInfo.buyPrice;

    // Find the corresponding order
    const order = await orderModel.findOne({ orderDetails: orderDetailId });

    if (!order) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order not found for the given order detail",
      });
    }

    // Update the order's cost
    order.cost += costChange;
    await order.save();

    await orderDetail.save();

    return res.status(200).json({
      status: "Update order detail successfully",
      data: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const deleteOrderDetail = async (req, res) => {
  try {
    const orderDetailId = req.params.orderDetailId;

    // Validate orderDetailId
    if (!mongoose.Types.ObjectId.isValid(orderDetailId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order Detail ID is not valid!",
      });
    }

    const orderDetail = await orderDetailModel.findById(orderDetailId).populate('product');

    if (!orderDetail) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order Detail not found",
      });
    }

    // Find the corresponding order
    const order = await orderModel.findOne({ orderDetails: orderDetailId });

    if (!order) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order not found",
      });
    }

    // Increase the product amount based on the quantity of the deleted order detail
    const productInfo = await productModel.findById(orderDetail.product);
    productInfo.amount += orderDetail.quantity;
    await productInfo.save();

    // Update the order's cost
    order.cost -= orderDetail.quantity * productInfo.buyPrice;
    await order.save();

    // Set the isDeleted field to true
    orderDetail.isDeleted = true;
    await orderDetail.save();

    return res.status(200).json({
      status: "Order detail deleted successfully",
      data: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = {
  createOrderDetailOfOrder,
  getAllOrderDetailOfOrder,
  getOrderDetailById,
  updateOrderDetail,
  deleteOrderDetail,
};
