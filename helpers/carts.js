const pool = require("../db/db");
const createError = require("http-errors");

const { createOrder, createOrderItems } = require("./orders");

const getCarts = async () => {
  const carts = await pool.query("SELECT id as cart_id, user_id FROM carts");
  if (carts.rows?.length) {
    return carts.rows;
  }
  return null;
};

const createCart = async (userId) => {
  try {
    const query = "INSERT INTO carts (user_id) VALUES ($1) RETURNING *";
    const newCart = await pool.query(query, [userId]);

    return newCart.rows;
  } catch (err) {
    throw err;
  }
};

const emptyCart = async (cartId) => {
  const deleteQuery = "DELETE FROM cartitems WHERE cart_id = $1 RETURNING *";
  const deletedProduct = await pool.query(deleteQuery, [cartId]);
  return deletedProduct.rows;
};

const getCartByUserId = async (userId) => {
  const selectQuery = {
    query: "SELECT id as cart_id, user_id FROM carts WHERE user_id = $1",
    values: [userId],
  };

  const userCart = await pool.query(selectQuery.query, selectQuery.values);

  if (userCart.rows?.length) {
    return userCart.rows;
  }

  return null;
};

const getProductsInCart = async (userId) => {
  const query =
    "SELECT products.id AS product_id, products.name, products.description, products.category, cartitems.quantity, products.price AS price_per_unit FROM carts JOIN cartitems ON cartitems.cart_id = carts.id JOIN products ON products.id = cartitems.product_id WHERE user_id = $1 GROUP BY products.id, cartitems.quantity";

  const productsInCart = await pool.query(query, [userId]);

  if (productsInCart.rows?.length) {
    return productsInCart.rows;
  }

  return null;
};

const addProductToCart = async (data) => {
  const { cartId, productId, quantity } = data;

  const insert = {
    query:
      "INSERT INTO cartitems (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    values: [cartId, productId, quantity],
  };

  const insertProduct = await pool.query(insert.query, insert.values);

  return insertProduct.rows[0];
};

const updateProductsInCart = async (data) => {
  const { cartId, productId, quantity } = data;

  const updateQuery = {
    query:
      "UPDATE cartitems SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
    values: [quantity, cartId, productId],
  };

  const updatedCart = await pool.query(updateQuery.query, updateQuery.values);

  return updatedCart.rows[0];
};

const deleteProductInCart = async (data) => {
  const { cartId, productId } = data;

  const deleteQuery = {
    query:
      "DELETE FROM cartitems WHERE cart_id = $1 AND product_id = $2 RETURNING *",
    values: [cartId, productId],
  };

  const deletedProduct = await pool.query(
    deleteQuery.query,
    deleteQuery.values
  );

  return deletedProduct.rows[0];
};

const totalPrice = (cartItems) => {
  const total = Number(
    cartItems
      .reduce((total, item, index) => {
        return total + item.price_per_unit * item.quantity;
      }, 0)
      .toFixed(2)
  );

  return total;
};

const checkoutCart = async (cartId, userId) => {
  const cartItems = await getProductsInCart(userId);

  // if cart is not empty
  if (cartItems) {
    const total = totalPrice(cartItems);
    const newOrder = await createOrder(total, userId);
    await createOrderItems(cartItems, newOrder[0].id);
    await emptyCart(cartId);

    return newOrder[0];
  }
  throw createError(404, "Cart is empty");
};

module.exports = {
  getCarts,
  createCart,
  getCartByUserId,
  getProductsInCart,
  addProductToCart,
  updateProductsInCart,
  deleteProductInCart,
  emptyCart,
  checkoutCart,
};
