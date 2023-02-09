const pool = require("../db/db");

// gets all orders
const getAllOrders = async () => {
  try {
    const query =
      "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id";

    const orders = await pool.query(query);

    if (orders.rows?.length) {
      return orders.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

// gets all orders for a specific user
const getUserOrders = async (id) => {
  try {
    const query =
      "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id AND orders.user_id = $1";

    const orders = await pool.query(query, [id]);

    if (orders.rows?.length) {
      return orders.rows;
    }

    return "This user has not ordered any products!";
  } catch (err) {
    throw err;
  }
};

const getOrdersById = async (id, userId) => {
  try {
    const query = "SELECT * FROM orders WHERE id = $1 AND user_id = $2";

    const order = await pool.query(query, [id, userId]);

    if (order.rows?.length) {
      return order.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getOrderItemsById = async (id, userId) => {
  try {
    const query =
      "SELECT product.id, product.name, product.description, product.category, products_orders.quantity, product.price AS price_per_unit FROM product JOIN products_orders ON products_orders.product_id = product.id WHERE orders_id = $1 ORDER BY product.id";

    // check of order exists before getting order details
    const orderExists = await getOrdersById(id, userId);
    if (orderExists) {
      const orderDetails = await pool.query(query, [id]);

      return orderDetails.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const deleteOrder = async (orderId, userId) => {
  try {
    const orderExists = await getOrdersById(orderId, userId);
    console.log(orderExists);

    if (orderExists) {
      const query = "DELETE FROM orders WHERE id = $1 RETURNING *";

      // delete order items first to avoid foreign key contraint errors
      const deletedOrderItems = await deleteOrderItems(orderId);
      const deletedOrder = await pool.query(query, [orderId]);
      
      return deletedOrder.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const deleteOrderItems = async (orderId) => {
  try {
    const query = "DELETE FROM products_orders WHERE orders_id = $1 RETURNING *";
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
