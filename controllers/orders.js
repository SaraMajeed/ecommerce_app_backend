const {
  getAllOrders,
  getUserOrders,
  getOrdersById,
  getOrderItemsById,
  deleteOrder,
} = require("../helpers/orders");

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).send(orders);
  } catch (err) {
    res.status(404);
    throw err;
  }
};
const getUserOrdersController = async (req, res) => {
  try {
    const orders = await getUserOrders(req.params.userId);
    res.status(200).send(orders);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const getOrdersByIdController = async (req, res) => {
  try {
    const order = await getOrdersById(req.params.orderId, req.params.userId);
    res.status(200).send(order);
  } catch (err) {
    res.status(404); 
    throw err;
  }
};

const getOrderItemsByIdController = async (req, res) => {
  try {
    const orderItems = await getOrderItemsById(req.params.orderId, req.params.userId);
    res.status(200).send(orderItems);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const deleteOrderController = async (req, res) => {
  try {
    const deletedOrder = await deleteOrder(req.params.orderId, req.params.userId);
    res.status(200).send(deletedOrder);
  } catch (err) {
    res.status(404);
    throw err;
  }
}



module.exports = {
  getAllOrdersController,
  getUserOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
  deleteOrderController
};
