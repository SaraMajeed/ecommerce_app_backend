const { Router } = require("express");
const productRouter = Router();

const productsController = require("../controllers/products");
const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware")

module.exports = (app) => {
  app.use("/products", productRouter);

  productRouter.get("/", productsController.getProducts);

  productRouter.post("/", isLoggedIn, isAdmin, productsController.createNewProduct);

  productRouter.get("/:productId", productsController.getProductById);

  productRouter.put(
    "/:productId",
    isLoggedIn,
    isAdmin,
    productsController.updateProductById
  );

  productRouter.delete(
    "/:productId",
    isLoggedIn,
    isAdmin,
    productsController.deleteProductById
  );
};
