const { Router } = require("express");
const productRouter = Router();

const productsController = require("../controllers/products");

module.exports = (app) => {
  app.use("/products", productRouter);

  productRouter.get("/", productsController.getProducts);

  productRouter.post("/", productsController.createNewProduct); // admin only

  productRouter.get("/:productId", productsController.getProductById);

  productRouter.put("/:productId", productsController.updateProductById); // admin only

  productRouter.delete("/:productId", productsController.deleteProductById); // admin only
};
