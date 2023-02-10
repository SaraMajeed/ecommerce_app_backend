const {
  addProductToCartController,
  getCartsController,
  getCartByUserIdController,
  getProductsInCartController,
  updateProductsInCartController,
  deleteProductInCartController,
  emptyCartController
} = require("../controllers/carts");

const { getUserById } = require("../helpers/users");

const { isLoggedIn } = require("../middleware/authMiddleware");

const cartsRouter = require("express").Router();

module.exports = (app) => {
  app.use("/carts", cartsRouter);

  cartsRouter.get("/", getCartsController); //admin only

  cartsRouter.get("/:userId", isLoggedIn, getCartByUserIdController);

  cartsRouter.post("/:cartId/:productId", isLoggedIn, addProductToCartController);

  cartsRouter.put("/:cartId/:productId", isLoggedIn, updateProductsInCartController);

  cartsRouter.delete("/:cartId", isLoggedIn, emptyCartController);

  cartsRouter.delete(
    "/:cartId/:productId",
    isLoggedIn,
    deleteProductInCartController
  );

  cartsRouter.get("/:userId/products", isLoggedIn, getProductsInCartController);

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