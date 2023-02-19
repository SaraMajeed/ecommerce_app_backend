const cartsRouter = require("express").Router();
const cartsController = require("../controllers/carts");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/carts", cartsRouter);

  cartsRouter.get("/", isLoggedIn, isAdmin, cartsController.getCarts); //admin only

  cartsRouter.get("/:userId", isLoggedIn, cartsController.getCartByUserId);

  cartsRouter.post(
    "/:cartId",
    isLoggedIn,
    cartsController.addProductToCart
  );

  cartsRouter.put(
    "/:cartId/:productId",
    isLoggedIn,
    cartsController.updateProductsInCart
  );

  cartsRouter.delete("/:cartId", isLoggedIn, cartsController.emptyCart);

  cartsRouter.delete(
    "/:cartId/:productId",
    isLoggedIn,
    cartsController.deleteProductInCart
  );

  cartsRouter.get(
    "/:userId/products",
    isLoggedIn,
    cartsController.getProductsInCart
  );

  cartsRouter.post(
    "/:cartId/checkout",
    isLoggedIn,
    cartsController.checkoutCart
  );
};
