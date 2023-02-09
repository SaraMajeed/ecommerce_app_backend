const ordersRouter = require("express").Router();

const {
  getAllOrdersController,
  getUserOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
  deleteOrderController,
} = require("../controllers/orders");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", getAllOrdersController);

  ordersRouter.get("/:userId", getUserOrdersController);

  ordersRouter.get("/:userId/:orderId", getOrdersByIdController);

  ordersRouter.delete("/:userId/:orderId", deleteOrderController);

  ordersRouter.get("/:userId/:orderId/details", getOrderItemsByIdController);
}

