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
    const data = req.body;
    const newProduct = await productHelpers.createNewProduct(data);

    res.status(201).json({
      message: "Successfully created product",
      // @SaraMajeed
      // Save yourself some typing and use the spread operator
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      product: {
        ...newProduct,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const  data = req.body;
    const response = await productHelpers.updateProductById({
      ...data,
      productId,
    });

    res.status(200).json({
      message: "Successfully updated product",
      updatedProduct: {
        ...response
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const response = await productHelpers.deleteProductById(productId);

    res.status(200).json({
      message: "Successfully deleted product",
      deletedProduct: {
        ...response,
      },
    });
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
