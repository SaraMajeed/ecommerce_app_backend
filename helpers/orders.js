const pool = require("../db/db");

// gets all orders
const getAllOrders = async () => {
  const query =
    "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id";
  const orders = await pool.query(query);

  if (orders.rows?.length) {
    return orders.rows;
  }

  return null;
};

// gets all orders for a specific user
const getUserOrders = async (userId) => {
  const query =
    "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id AND orders.user_id = $1";

  const orders = await pool.query(query, [userId]);

  if (orders.rows?.length) {
    return orders.rows;
  }

  return "This user has not ordered any products!";
};

const getOrdersById = async (orderId, userId) => {
  const query = "SELECT * FROM orders WHERE id = $1 AND user_id = $2";

  const order = await pool.query(query, [orderId, userId]);

  if (order.rows?.length) {
    return order.rows;
  }

  return null;
};

const getOrderItemsById = async (orderId, userId) => {
  const query =
    "SELECT product.id, product.name, product.description, product.category, products_orders.quantity, product.price AS price_per_unit FROM product JOIN products_orders ON products_orders.product_id = product.id WHERE orders_id = $1 ORDER BY product.id";

  // check if order exists before getting order details
  const orderExists = await getOrdersById(orderId, userId);
  if (orderExists) {
    const orderDetails = await pool.query(query, [orderId]);

    return orderDetails.rows;
  }

  return null;
};

const deleteOrder = async (orderId, userId) => {
  const orderExists = await getOrdersById(orderId, userId);

  if (orderExists) {
    const query = "DELETE FROM orders WHERE id = $1 RETURNING *";

    // delete order items first to avoid foreign key contraint errors
    const deletedOrderItems = await deleteOrderItems(orderId);
    const deletedOrder = await pool.query(query, [orderId]);

    return deletedOrder.rows;
  }

  return null;
};

const deleteOrderItems = async (orderId) => {
  try {
    const query =
      "DELETE FROM products_orders WHERE orders_id = $1 RETURNING *";
    const deletedOrderItems = await pool.query(query, [orderId]);
    return deletedOrderItems.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  getOrdersById,
  getOrderItemsById,
  deleteOrder,
};
