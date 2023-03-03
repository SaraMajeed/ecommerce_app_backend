const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders");

const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", isLoggedIn, isAdmin, ordersController.getAllOrders);

  ordersRouter.get("/myOrders", isLoggedIn, ordersController.getUserOrders);


  ordersRouter.get(
    "/myOrders/:orderId",
    isLoggedIn,
    ordersController.getOrderById
  );

  ordersRouter.get(
    "/myOrders/:orderId/details",
    isLoggedIn,
    ordersController.getOrderItemsById
  );
};
