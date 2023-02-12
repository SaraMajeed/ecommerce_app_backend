const productHelpers = require("../helpers/products");

const getProducts = async (req, res, next) => {
  const { category, name } = req.query;

  try {
    let response;
    if (category) {
      response = await productHelpers.getProductsByCategory(category);
    } else if (name) {
      response = await productHelpers.getProductByName(name);
    } else {
      response = await productHelpers.getProducts();
    }

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const response = await productHelpers.getProductById(productId);

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const createNewProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const response = await productHelpers.createNewProduct({
      name,
      description,
      price,
      category,
    });

    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category } = req.body;
    const response = await productHelpers.updateProductById({
      name,
      description,
      price,
      category,
      productId,
    });

    res.status(200).send(response);
    
  } catch (err) {
    next(err);
  }
};

//TODO: fix constraint violation error
const deleteProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const response = await productHelpers.deleteProductById(productId);

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  createNewProduct,
};
