const cartsController = require("../controllers/carts");

const { getUserById } = require("../helpers/users");

const { isLoggedIn } = require("../middleware/authMiddleware");

const cartsRouter = require("express").Router();

module.exports = (app) => {
  app.use("/carts", cartsRouter);

  cartsRouter.get("/", cartsController.getCarts); //admin only

  cartsRouter.get("/:userId", isLoggedIn, cartsController.getCartByUserId);

  cartsRouter.post(
    "/:cartId/:productId",
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

  // cartsRouter.post("/:cartId/checkout", isLoggedIn, checkoutCartController);

  cartsRouter.param("id", async (req, res, next, id) => {
    try {
      let user = await getUserById(id);
      if (user) {
        req.user = user.id;
        next();
      } else {
        next(new Error("User does not exist!"));
      }
    } catch (err) {
      next(err);
    }
  });
}