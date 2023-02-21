const pool = require("../db/db");
const createError = require("http-errors");

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
    "SELECT orders.id AS order_id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id AND orders.user_id = $1";

  const orders = await pool.query(query, [userId]);

  if (orders.rows?.length) {
    return orders.rows;
  }

  return null;
};

const getOrderById = async (orderId, userId) => {
  const query = "SELECT * FROM orders WHERE id = $1 AND user_id = $2";

  const order = await pool.query(query, [orderId, userId]);

  if (order.rows?.length) {
    return order.rows;
  }

  throw createError(404, `No order found with id: ${orderId}` );
};

const getOrderItemsById = async (orderId, userId) => {
  const query =
    "SELECT products.id AS product_id, products.name, products.description, products.category, orderitems.quantity, products.price AS price_per_unit FROM products JOIN orderitems ON orderitems.product_id = products.id WHERE order_id = $1 ORDER BY products.id";

  // check if order exists before getting order details
  const orderExists = await getOrderById(orderId, userId);
  if (orderExists) {
    const orderDetails = await pool.query(query, [orderId]);

    return orderDetails.rows;
  }

  return null;
};

const deleteOrder = async (orderId, userId) => {
  const orderExists = await getOrderById(orderId, userId);

  if (orderExists) {
    const query = "DELETE FROM orders WHERE id = $1 RETURNING *";
    const deletedOrder = await pool.query(query, [orderId]);

    return deletedOrder.rows[0];
  }

  return null;
};


const createOrder = async (total, userId) => {
  try {
    const insertQuery = {
      query:
        "INSERT INTO orders (total_price, user_id) VALUES ($1, $2) RETURNING *",
      values: [total, userId],
    };
    const newOrder = await pool.query(insertQuery.query, insertQuery.values);

    return newOrder.rows;
  } catch (err) {
    throw err;
  }
};

const createOrderItems = async (cartItems, orderId) => {
  try {
    const insertOrderItemsQuery =
      "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)";

    for (item in cartItems) {
      await pool.query(insertOrderItemsQuery, [
        orderId,
        cartItems[item].product_id,
        cartItems[item].quantity,
      ]);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  getOrderById,
  getOrderItemsById,
  deleteOrder,
  createOrder,
  createOrderItems,
};
