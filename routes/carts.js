const cartsRouter = require("express").Router();
const cartsController = require("../controllers/carts");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/carts", cartsRouter);

  cartsRouter.get("/", isLoggedIn, isAdmin, cartsController.getCarts);

   cartsRouter.get(
     "/myCart",
     isLoggedIn,
     cartsController.getProductsInCart
   );

  // cartsRouter.get("/myCart", isLoggedIn, cartsController.getCartByUserId);

  cartsRouter.post(
    "/myCart",
    isLoggedIn,
    cartsController.addProductToCart
  );

  cartsRouter.delete("/myCart", isLoggedIn, cartsController.emptyCart);

  cartsRouter.put(
    "/myCart/:productId",
    isLoggedIn,
    cartsController.updateProductInCart
  );

  cartsRouter.delete(
    "/myCart/:productId",
    isLoggedIn,
    cartsController.deleteProductInCart
  );

  cartsRouter.post(
    "/myCart/checkout",
    isLoggedIn,
    cartsController.checkoutCart
  );
};
