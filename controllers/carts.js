const cartHelpers = require("../helpers/carts");

const getCarts = async (req, res, next) => {
  try {
    const carts = await cartHelpers.getCarts();
    res.status(200).send(carts);
  } catch (err) {
    // Use the next middleware to handle errors
    next(err);
  }
};

const getCartByUserId = async (req, res, next) => {
  try {
    const cart = await cartHelpers.getCartByUserId(req.user.id);
    res.status(200).send(cart);
  } catch (err) {
    next(err);
  }
};

const getProductsInCart = async (req, res, next) => {
  try {
    const productsInCart = await cartHelpers.getProductsInCart(req.user.id);
    res.status(200).send(productsInCart);
  } catch (err) {
    next(err);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { cartId } = req.user;
    const { productId, quantity } = req.body;

    const newProductInCart = await cartHelpers.addProductToCart({
      cartId,
      productId,
      quantity,
    });

    res.status(201).send(newProductInCart);
  } catch (err) {
    next(err);
  }
};

const updateProductsInCart = async (req, res, next) => {
  try {
    const updatedProductsInCart = await cartHelpers.updateProductsInCart({
      cartId: req.user.cartId,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });

    res.status(200).send(updatedProductsInCart);
  } catch (err) {
    next(err);
  }
};

const deleteProductInCart = async (req, res, next) => {
  try {
    const deletedProductInCart = await cartHelpers.deleteProductInCart({
      cartId:req.user.cartId,
      productId: req.params.productId,
    });
    res.status(204).send(deletedProductInCart);
  } catch (err) {
    next(err);
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const deletedProducts = await cartHelpers.emptyCart(req.user.cartId);

    res.status(204).send(deletedProducts);
  } catch (err) {
    next(err);
  }
};

const checkoutCart = async (req, res, next) => {
  try {
    const checkoutCart = await cartHelpers.checkoutCart(req.user.cartId, req.user.id);

    res.status(201).json({ 
      message: "Successfully submitted order",
      orderDetails: {
        orderID: checkoutCart.id,
        date: checkoutCart.date,
        total_price: "£" + checkoutCart.total_price
      }
     });
  } catch (err) {
    next(err); 
  }
}

module.exports = {
  getCarts,
  addProductToCart,
  getCartByUserId,
  getProductsInCart,
  updateProductsInCart,
  deleteProductInCart,
  emptyCart,
  checkoutCart,
};
