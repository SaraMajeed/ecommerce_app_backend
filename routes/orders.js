const ordersRouter = require("express").Router();

const {
  getAllOrdersController,
  getUserOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
  deleteOrderController,
} = require("../controllers/orders");

const { isLoggedIn } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", getAllOrdersController); // admin only

  ordersRouter.get("/:userId", isLoggedIn, getUserOrdersController);

  ordersRouter.get("/:userId/:orderId", isLoggedIn, getOrdersByIdController);

  ordersRouter.get("/:userId/:orderId/details", isLoggedIn, getOrderItemsByIdController);
}

