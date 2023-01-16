const { Router } = require("express");
const productRouter = Router();

const {
  getProductById,
  getProducts,
  getProductByName,
  getProductsByCategory,
} = require("../helpers/products");



module.exports = (app) => {

  app.use("/products", productRouter);

  productRouter.get("/", async (req, res) => {
    const { category, name } = req.query;

    try {
      let response;
      if (category) {
        response = await getProductsByCategory(category);
      } else if (name) {
        response = await getProductByName(name);
      } else {
        response = await getProducts();
      }
      
      res.send(response);
    } catch (err) {
      throw err;
    }
  });

  productRouter.get("/:productId", getProductById);
};

