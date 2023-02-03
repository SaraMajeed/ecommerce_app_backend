const {
  getCarts,
  getCartById,
  getProductsInCart
} = require("../helpers/carts");

const cartsRouter = require("express").Router({ mergeParams: true });

cartsRouter.get('/', getCarts)

cartsRouter.get('/:cartId', getCartById)

// cartsRouter.get("/:cartId/products", getProductsInCart);


module.exports = cartsRouter