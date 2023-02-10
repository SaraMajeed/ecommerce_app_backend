const pool = require("../db/db");
const createError = require("http-errors");

const { getProductById } = require("./products");

const getCarts = async () => {
  const carts = await pool.query("SELECT * FROM cart");
  if (carts.rows?.length) {
    return carts.rows;
  }
  return null;
};

const createCart = async (id) => {
  try {
    const query = "INSERT INTO cart (user_id) VALUES ($1) RETURNING *";
    const newCart = await pool.query(query, [id]);

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

// const getCartById = async (data) => {
//   try {
//     const { cartId, userId } = data;

//     const selectQuery = {
//       query: "SELECT * FROM cart WHERE user_id = $1 AND id = $2",
//       values: [userId, cartId],
//     };

//     const userCart = await pool.query(selectQuery.query, selectQuery.values);

//     if (userCart.rows?.length) {
//       return userCart.rows;
//     }

//     return null;
//   } catch (err) {
//     throw err;
//   }
// };

const getProductsInCart = async (userId) => {
  const query =
    "SELECT product.id, product.name, product.description, product.category, carts_products.quantity, SUM(product.price * carts_products.quantity) AS price FROM cart JOIN carts_products ON carts_products.cart_id = cart.id JOIN product ON product.id = carts_products.product_id WHERE user_id = $1 GROUP BY product.id, carts_products.quantity";

  const productsInCart = await pool.query(query, [userId]);

  if (productsInCart.rows?.length) {
    return productsInCart.rows;
  }

  return null;
};

const getSingleProductInCart = async (data) => {
  try {
    const { cartId, productId } = data;

    const selectQuery = {
      query:
        "SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2",
      values: [cartId, productId],
    };

    const productInCart = await pool.query(
      selectQuery.query,
      selectQuery.values
    );

    if (productInCart.rows?.length) {
      return productInCart.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const addProductToCart = async (data) => {
  const { cartId, productId, quantity } = data;

  const insert = {
    query:
      "INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    values: [cartId, productId, quantity],
  };

  // @SaraMajeed this part is probably not necessary. If the product is displaying on the front-end
  // then it MUST exist in the database as that's where we got it from.

  //checks if product exists before adding it
  // const productExists = await getProductById(productId);

  //if (productExists) {
  const insertProduct = await pool.query(insert.query, insert.values);
  return insertProduct.rows[0];
  // }

  //return "Cannot add! This product does not exist!";
};

const updateProductsInCart = async (data) => {
  const { cartId, productId, quantity } = data;

  const updateQuery = {
    query:
      "UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
    values: [quantity, cartId, productId],
  };

  //checks if product exists in cart before updating data

  // @SaraMajeed this is probably not needed, as if a product is being displayed on the front-end
  // as being in their cart, it should be in their cart in the database.

  // const productExistsInCart = await getSingleProductInCart({
  //   cartId,
  //   productId,
  // });

  //if (productExistsInCart) {
  const updatedCart = await pool.query(updateQuery.query, updateQuery.values);

  return updatedCart.rows;
  //}

  //return "Cannot update! This product does not exist in your cart!";
};

const deleteProductInCart = async (data) => {
  const { cartId, productId } = data;

  const deleteQuery = {
    query:
      "DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *",
    values: [cartId, productId],
  };

  //checks if product exists in cart before deleting it

  // probably not needed
  // const productExistsInCart = await getSingleProductInCart({
  //   cartId,
  //   productId,
  // });

  // if (!productExistsInCart) {
  //   return "Cannot delete! This product does not exist in your cart!";
  // }

  const deletedProduct = await pool.query(
    deleteQuery.query,
    deleteQuery.values
  );

  return `Sucessfully deleted: 
      product: ${deletedProduct.rows[0].product_id}
      quantity: ${deletedProduct.rows[0].quantity}`;
};

module.exports = {
  getCarts,
  createCart,
  deleteCart,
  getCartByUserId,
  getProductsInCart,
  addProductToCart,
  updateProductsInCart,
  getSingleProductInCart,
  deleteProductInCart,
  emptyCart,
};
