const cartsRouter = require("express").Router();
const cartsController = require("../controllers/carts");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/carts", cartsRouter);

  cartsRouter.get("/", isLoggedIn, isAdmin, cartsController.getCarts); //admin only

  cartsRouter.get("/myCart", isLoggedIn, cartsController.getCartByUserId);

  cartsRouter.post(
    "/myCart",
    isLoggedIn,
    cartsController.addProductToCart
  );

  cartsRouter.put(
    "/myCart/:productId",
    isLoggedIn,
    cartsController.updateProductsInCart
  );

  cartsRouter.delete("/myCart", isLoggedIn, cartsController.emptyCart);

  cartsRouter.delete(
    "/myCart/:productId",
    isLoggedIn,
    cartsController.deleteProductInCart
  );

  cartsRouter.get(
    "/myCart/products",
    isLoggedIn,
    cartsController.getProductsInCart
  );

  cartsRouter.post(
    "/myCart/checkout",
    isLoggedIn,
    cartsController.checkoutCart
  );
};
