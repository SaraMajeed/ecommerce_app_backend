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
    // you might as well not destructure the object if you're going
    // to make another object
    // const { name, description, price, category } = req.body;

    // const newProduct = await productHelpers.createNewProduct({
    //   name,
    //   description,
    //   price,
    //   category,
    // });
    const data = req.body;
    const newProduct = await productHelpers.createNewProduct(data);

    res.status(201).json({
      message: "Successfully created product",
      // @SaraMajeed
      // Save yourself some typing and use the spread operator
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      ...newProduct,
      // product: {
      //   name: newProduct[0].name,
      //   description: newProduct[0].description,
      //   price: newProduct[0].price,
      //   category: newProduct[0].category,
      // },
    });
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

    res.status(200).json({
      message: "Successfully updated product",
      updatedProduct: {
        name: response.name,
        description: response.description,
        price: response.price,
        category: response.category,
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
      ...response,
      // deletedProduct: {
      //   name: response.name,
      //   description: response.description,
      //   price: response.price,
      //   category: response.category,
      // },
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
