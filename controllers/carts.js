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

    res.status(201).json({
      message: "Successfully added product to cart",
      newCartItem: {
        productId: newProductInCart.product_id,
        quantity: newProductInCart.quantity,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProductInCart = async (req, res, next) => {
  try {
    const updatedProductInCart = await cartHelpers.updateProductsInCart({
      cartId: req.user.cart_id,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });

    res.status(200).json({
      message: "Successfully updated product in cart",
      updatedCartItem: {
        productId: updatedProductInCart.product_id,
        quantity: updatedProductInCart.quantity,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteProductInCart = async (req, res, next) => {
  try {
    const deletedProductInCart = await cartHelpers.deleteProductInCart({
      cartId: req.user.cart_id,
      productId: req.params.productId,
    });
    res.status(200).json({
      message: "Successfully deleted product from cart",
      deletedCartItem: {
        productId: deletedProductInCart.product_id,
        quantity: deletedProductInCart.quantity,
      },
    });
  } catch (err) {
    next(err);
  }
};

const emptyCart = async (req, res, next) => {
  try {
    await cartHelpers.emptyCart(req.user.cart_id);

    res.status(200).json({ message: "Successfully emptied cart" });
  } catch (err) {
    next(err);
  }
};

const checkoutCart = async (req, res, next) => {
  try {
    const checkoutCart = await cartHelpers.checkoutCart(
      req.user.cart_id,
      req.user.id
    );

    res.status(201).json({
      message: "Successfully submitted order",
      orderDetails: {
        orderID: checkoutCart.id,
        date: checkoutCart.date,
        total_price: "£" + checkoutCart.total_price,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCarts,
  addProductToCart,
  getProductsInCart,
  updateProductInCart,
  deleteProductInCart,
  emptyCart,
  checkoutCart,
};
