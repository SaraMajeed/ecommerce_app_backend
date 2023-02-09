const ordersRouter = require("express").Router();

const {
  getAllOrdersController,
  getOrdersByIdController,
  getOrderItemsByIdController,
} = require("../controllers/orders");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", getAllOrdersController);

  ordersRouter.get("/:orderId", getOrdersByIdController);

  ordersRouter.get("/:orderId/details", getOrderItemsByIdController);
}

