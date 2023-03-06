const cartsRouter = require("express").Router();
const cartsController = require("../controllers/carts");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/carts", isLoggedIn, cartsRouter);

  cartsRouter.get("/", isAdmin, cartsController.getCarts);

  cartsRouter.get("/myCart", cartsController.getProductsInCart);

  cartsRouter.post("/myCart", cartsController.addProductToCart);

  cartsRouter.delete("/myCart", cartsController.emptyCart);

  cartsRouter.put("/myCart/:productId", cartsController.updateProductInCart);

  cartsRouter.delete("/myCart/:productId", cartsController.deleteProductInCart);

  cartsRouter.post("/myCart/checkout", cartsController.checkoutCart);
};
