const {
  getProducts,
  getProductsByCategory,
  getProductByName,
  getProductById,
  updateProductById,
  deleteProductById,
  createNewProduct,
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

const createNewProductController = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const response = await createNewProduct({
      name,
      description,
      price,
      category,
    });

    res.status(201).send(response);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const updateProductByIdController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category } = req.body;
    const response = await updateProductById({
      name,
      description,
      price,
      category,
      productId,
    });

    if (typeof response === "string") {
      res.status(404).send(response);
    } else {
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(404);
    throw err;
  }
};

//TODO: fix constraint violation error
const deleteProductByIdController = async (req, res) => {
  try {
    const { productId } = req.params;
    const response = await deleteProductById(productId);

    res.status(200).send(response);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

module.exports = {
  getProductsController,
  getProductByIdController,
  updateProductByIdController,
  deleteProductByIdController,
  createNewProductController,
};
