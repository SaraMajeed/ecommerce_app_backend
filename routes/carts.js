const {
  addProductToCartController,
  getCartsController,
  getCartByIdController,
  getProductsInCartController,
  updateProductsInCartController,
  deleteProductInCartController,
  getSingleProductInCartController
} = require("../controllers/carts");

const cartsRouter = require("express").Router({ mergeParams: true });

cartsRouter.get("/", getCartsController);

cartsRouter.get("/:cartId", getCartByIdController);

cartsRouter.post("/:cartId", addProductToCartController);

cartsRouter.put("/:cartId", updateProductsInCartController);

cartsRouter.delete("/:cartId", deleteProductInCartController);

cartsRouter.get("/:cartId/products", getProductsInCartController);

cartsRouter.get('/:cartId/products/:productId', getSingleProductInCartController)



module.exports = cartsRouter;
