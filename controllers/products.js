const {
  getProducts,
  getProductsByCategory,
  getProductByName,
  getProductById,
  updateProductById
} = require("../helpers/products");

const getProductsController = async (req, res) => {
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

    res.status(200).send(response);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const { productId } = req.params;
    const response = await getProductById(productId);

    res.status(200).send(response);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const updateProductByIdController = async (req, res) => {
    try {
      const { productId } = req.params;
      const { name, description, price, category } = req.body;
      const response = await updateProductById({name, description, price, category, productId});

      res.status(200).send(response);
    } catch (err) {
      res.status(404);
      throw err;
    }
}

module.exports = {
  getProductsController,
  getProductByIdController,
  updateProductByIdController,
};
