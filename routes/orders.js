const ordersRouter = require("express").Router({ mergeParams: true });

const {
  getOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
} = require("../controllers/orders");

ordersRouter.get("/", getOrdersController);

ordersRouter.get("/:orderId", getOrdersByIdController);

ordersRouter.get("/:orderId/details", getOrderItemsByIdController);

module.exports = ordersRouter;
