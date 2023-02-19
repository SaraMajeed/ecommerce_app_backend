const { Router } = require("express");
const productRouter = Router();

const productsController = require("../controllers/products");
const { isAdmin } = require("../middleware/authMiddleware")

module.exports = (app) => {
  app.use("/products", productRouter);

  productRouter.get("/", productsController.getProducts);

  productRouter.post("/", isAdmin, productsController.createNewProduct);

  productRouter.get("/:productId", productsController.getProductById);

  productRouter.put("/:productId", isAdmin, productsController.updateProductById);

  productRouter.delete("/:productId", isAdmin, productsController.deleteProductById);
};
