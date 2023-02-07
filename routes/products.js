const { Router } = require("express");
const productRouter = Router();

const {
  getProductsController,
  getProductByIdController,
  updateProductByIdController,
  deleteProductByIdController,
  createNewProductController
} = require("../controllers/products");

module.exports = (app) => {
  app.use("/products", productRouter);

  productRouter.get("/", getProductsController);

  productRouter.post("/", createNewProductController);

  productRouter.get("/:productId", getProductByIdController);

  productRouter.put("/:productId", updateProductByIdController)

  productRouter.delete("/:productId", deleteProductByIdController);
};
