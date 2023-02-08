const {
  getOrders,
  getOrdersById,
  getOrderItemsById,
} = require("../helpers/orders");

const getOrdersController = async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).send(orders);
  } catch (error) {
    res.status(404);
    throw err;
  }
};

const getOrdersByIdController = async (req, res) => {
  try {
    const order = await getOrdersById(req.params.orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(404);
    throw err;
  }
};

const getOrderItemsByIdController = async (req, res) => {
  try {
    const orderItems = await getOrderItemsById(req.params.orderId);
    res.status(200).send(orderItems);
  } catch (err) {
    res.status(404);
    throw err;
  }
};



module.exports = {
  getOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
};
