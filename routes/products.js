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

  productRouter.post("/", createNewProductController); // admin only

  productRouter.get("/:productId", getProductByIdController);

  productRouter.put("/:productId", updateProductByIdController) // admin only

  productRouter.delete("/:productId", deleteProductByIdController); // admin only
};
