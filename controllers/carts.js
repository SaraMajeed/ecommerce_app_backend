const {
  getCarts,
  getCartById,
  getProductsInCart,
  addProductToCart,
  updateProductsInCart,
  deleteProductInCart,
  getSingleProductInCart,
} = require("../helpers/carts");

const getCartsController = async (req, res) => {
  try {
    const carts = await getCarts();
    res.status(200).send(carts);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const getCartByIdController = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await getCartById({cartId, userId: req.user});
    res.status(200).send(cart);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const getProductsInCartController = async (req, res) => {
  try {
    const productsInCart = await getProductsInCart(req.user);
    res.status(200).send(productsInCart);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const getSingleProductInCartController = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const singleProductInCart = await getSingleProductInCart({
      cartId,
      productId,
    });
    res.status(200).send(singleProductInCart);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const addProductToCartController = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { productId, quantity } = req.body;

    const newProductInCart = await addProductToCart({
      cartId,
      productId,
      quantity,
    });

    res.status(201).send(newProductInCart[0]);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const updateProductsInCartController = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { productId, quantity } = req.body;

    const updatedProductsInCart = await updateProductsInCart({
      cartId,
      productId,
      quantity,
    });

    res.status(200).send(updatedProductsInCart);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const deleteProductInCartController = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { productId } = req.body;

    const deletedProductInCart = await deleteProductInCart({
      cartId,
      productId,
    });

    res.status(200).send(deletedProductInCart);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

module.exports = {
  getCartsController,
  addProductToCartController,
  getCartByIdController,
  getProductsInCartController,
  updateProductsInCartController,
  deleteProductInCartController,
  getSingleProductInCartController,
};