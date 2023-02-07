const { Router } = require("express");
const productRouter = Router();

const {
  getProductsController,
  getProductByIdController,
  updateProductByIdController
} = require("../controllers/products");

module.exports = (app) => {
  app.use("/products", productRouter);

  productRouter.get("/", getProductsController);

  productRouter.get("/:productId", getProductByIdController);

  productRouter.put("/:productId", updateProductByIdController)
};
