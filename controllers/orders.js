const {
  getAllOrders,
  getUserOrders,
  getOrdersById,
  getOrderItemsById,
  deleteOrder,
} = require("../helpers/orders");

const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.status(200).send(orders);
  } catch (err) {
    // @SaraMajeed
    // Use the next() call to trigger the error
    // handler middleware defined in /loaders/index.js
    next(err);
  }
};
const getUserOrdersController = async (req, res, next) => {
  try {
    const orders = await getUserOrders(req.params.userId);
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrdersByIdController = async (req, res, next) => {
  try {
    const order = await getOrdersById(req.params.orderId, req.params.userId);
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

const getOrderItemsByIdController = async (req, res, next) => {
  try {
    const orderItems = await getOrderItemsById(
      req.params.orderId,
      req.params.userId
    );
    res.status(200).send(orderItems);
  } catch (err) {
    next(err);
  }
};

const deleteOrderController = async (req, res, next) => {
  try {
    const deletedOrder = await deleteOrder(
      req.params.orderId,
      req.params.userId
    );
    res.status(200).send(deletedOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOrdersController,
  getUserOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
  deleteOrderController,
};
