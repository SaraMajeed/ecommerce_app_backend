const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders");

const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/orders", isLoggedIn, ordersRouter);

  ordersRouter.get("/", isAdmin, ordersController.getAllOrders);

  ordersRouter.get("/myOrders", ordersController.getUserOrders);

  ordersRouter.get("/myOrders/:orderId", ordersController.getOrderById);

  ordersRouter.get(
    "/myOrders/:orderId/details",
    ordersController.getOrderItemsById
  );
};
