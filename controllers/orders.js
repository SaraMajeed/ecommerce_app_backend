const orderHelpers = require("../helpers/orders");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderHelpers.getAllOrders();
    res.status(200).send(orders);
  } catch (err) {
    // Use the next() call to trigger the error
    // handler middleware defined in /loaders/index.js
    next(err);
  }
};
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderHelpers.getUserOrders(req.user.id);
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrdersById = async (req, res, next) => {
  try {
    const order = await orderHelpers.getOrdersById(
      req.params.orderId,
      req.user.id
    );
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

const getOrderItemsById = async (req, res, next) => {
  try {
    const orderItems = await orderHelpers.getOrderItemsById(
      req.params.orderId,
      req.user.id
    );
    res.status(200).send(orderItems);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await orderHelpers.deleteOrder(
      req.params.orderId,
      req.user.id
    );
    res.status(200).send(deletedOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  getOrdersById,
  getOrderItemsById,
  deleteOrder,
};
