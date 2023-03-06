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
    const query = {
      text: "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      values: [userId]
    }
    const newCart = await pool.query(query);

    return newCart.rows;
  } catch (err) {
    throw err;
  }
};

const emptyCart = async (cartId) => {
  const query = {
    text: "DELETE FROM cartitems WHERE cart_id = $1",
    values: [cartId]
  }
  await pool.query(query);
};

const getCartByUserId = async (userId) => {
  const query = {
    text: "SELECT id as cart_id, user_id FROM carts WHERE user_id = $1",
    values: [userId],
  };

  const userCart = await pool.query(query);

  if (userCart.rows?.length) {
    return userCart.rows;
  }

  return null;
};

const getProductsInCart = async (userId) => {
  // @SaraMajeed
  // Sum up the totals of each product in the database, then you can
  // do some simple math in the front-end when you display the products in the cart
  const query = {
    text: `SELECT sum(products.price * cartitems.quantity) AS total,
            products.id AS product_id, products.name,
            products.description, products.category,
            sum(cartitems.quantity) as quantity, products.price AS price_per_unit
           FROM carts
           JOIN cartitems ON cartitems.cart_id = carts.id
           JOIN products ON products.id = cartitems.product_id
           WHERE user_id = $1
           GROUP BY products.id, cartitems.quantity;
    `,
    values: [userId],
  };

  const productsInCart = await pool.query(query);

  if (productsInCart.rows?.length) {
    return productsInCart.rows;
  }

  return null;
};

const addProductToCart = async (data) => {
  const { cart_id, product_id, quantity } = data;

  // @SaraMajeed
  // This way is a little cleaner in my opinion
  // Use a query config object
  // https://node-postgres.com/features/queries#query-config-object
  const query = {
    // @SaraMajeed
    // only return what you need (won't matter for a small project like this, but it's a good habit to get into)
    text: "INSERT INTO cartitems (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING product_id, quantity",
    values: [cart_id, product_id, quantity],
  };

  const insertProduct = await pool.query(query);
  return insertProduct.rows[0];
};

const updateProductsInCart = async (data) => {
  const { cart_id, product_id, quantity } = data;

  const query = {
    // @SaraMajeed
    // only return what you need (won't matter for a small project like this, but it's a good habit to get into)
    text: "UPDATE cartitems SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING quantity, product_id",
    values: [quantity, cart_id, product_id],
  };
  const updatedCart = await pool.query(query);
  return updatedCart.rows[0];
};

const deleteProductInCart = async (data) => {
  const { cart_id, product_id } = data;

  const query = {
    text: "DELETE FROM cartitems WHERE cart_id = $1 AND product_id = $2 RETURNING product_id, quantity",
    values: [cart_id, product_id],
  };

  const deletedProduct = await pool.query(query);

  return deletedProduct.rows[0];
};

const totalPrice = (cartItems) => {
  const total = Number(
    cartItems
      .reduce((total, item, index) => {
        return total + (item.total * 1);
      }, 0)
  );

  return total;
};

const checkoutCart = async (cartId, userId) => {
  const cartItems = await getProductsInCart(userId);

  // if cart is not empty
  if (cartItems) {
    const total = totalPrice(cartItems);
    const newOrder = await createOrder(total, userId);
    await createOrderItems(cartItems, newOrder.id);
    await emptyCart(cartId);

    return newOrder;
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
