const pool = require("../db/db");
const createError = require("http-errors");

const { createOrder, createOrderItems } = require("./orders");

const getCarts = async () => {
  const carts = await pool.query("SELECT * FROM cart");
  if (carts.rows?.length) {
    return carts.rows;
  }
  return null;
};

const createCart = async (userId) => {
  try {
    const query = "INSERT INTO cart (user_id) VALUES ($1) RETURNING *";
    const newCart = await pool.query(query, [userId]);

    return newCart.rows;
  } catch (err) {
    throw err;
  }
};

const emptyCart = async (cartId) => {
  const deleteQuery =
    "DELETE FROM carts_products WHERE cart_id = $1 RETURNING *";
  const deletedProduct = await pool.query(deleteQuery, [cartId]);
  return deletedProduct.rows;
};

const deleteCart = async (userId) => {
  try {
    const cartId = await getCartByUserId(userId);

    //delete products associated with a user's cart before deleting their cart to avoid a foreign key contraint violation
    const deleteProducts = await emptyCart(cartId[0].id);

    const query = "DELETE FROM cart WHERE user_id = $1 RETURNING *";
    const deletedCart = await pool.query(query, [userId]);

    return `Successfully deleted cart: ${deletedCart}`;
  } catch (err) {
    throw err;
  }
};

const getCartByUserId = async (userId) => {
  const selectQuery = {
    query: "SELECT * FROM cart WHERE user_id = $1",
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
    "SELECT product.id AS product_id, product.name, product.description, product.category, carts_products.quantity, product.price AS price_per_unit FROM cart JOIN carts_products ON carts_products.cart_id = cart.id JOIN product ON product.id = carts_products.product_id WHERE user_id = $1 GROUP BY product.id, carts_products.quantity";

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
      "INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    values: [cartId, productId, quantity],
  };

  const insertProduct = await pool.query(insert.query, insert.values);

  return insertProduct.rows[0];

};

const updateProductsInCart = async (data) => {
  const { cartId, productId, quantity } = data;

  const updateQuery = {
    query:
      "UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
    values: [quantity, cartId, productId],
  };

  const updatedCart = await pool.query(updateQuery.query, updateQuery.values);

  return updatedCart.rows;

};

const deleteProductInCart = async (data) => {
  const { cartId, productId } = data;

  const deleteQuery = {
    query:
      "DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *",
    values: [cartId, productId],
  };

  const deletedProduct = await pool.query(
    deleteQuery.query,
    deleteQuery.values
  );

  return `Sucessfully deleted: 
      product: ${deletedProduct.rows[0].product_id}
      quantity: ${deletedProduct.rows[0].quantity}`;
};

const totalPrice = (cartItems) => {
  const total = cartItems
    .reduce((total, item, index) => {
      return total + item.price_per_unit * item.quantity;
    }, 0)
    .toFixed(2);

  return total;
}

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
  deleteCart,
  getCartByUserId,
  getProductsInCart,
  addProductToCart,
  updateProductsInCart,
  deleteProductInCart,
  emptyCart,
  checkoutCart,
  totalPrice,
};
