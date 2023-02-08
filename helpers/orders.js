const pool = require("../db/db");

const getOrders = async (id) => {
  try {
    const query =
      "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id AND orders.user_id = $1";

    const orders = await pool.query(query, [req.user]);

    if (orders.rows?.length) {
      return orders.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getOrdersById = async (id) => {
  try {
    const query = "SELECT * FROM orders WHERE id = $1";

    const order = await pool.query(query, [id]);

    if (order.rows?.length) {
      return order.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getOrderItemsById = async (id) => {
  try {
    const query =
      "SELECT product.id, product.name, product.description, product.category, products_orders.quantity, product.price AS price_per_unit FROM product JOIN products_orders ON products_orders.product_id = product.id WHERE orders_id = $1 ORDER BY product.id";

    const orderDetails = pool.query(query, [id]);

    return orderDetails.rows;
  } catch (err) {
    throw err;
  }
};



module.exports = {
  getOrders,
  getOrdersById,
  getOrderItemsById,
};
