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
    ordersController.getOrdersById
  );

  ordersRouter.delete("/myOrders/:orderId", isLoggedIn, isAdmin, ordersController.deleteOrder); 

  ordersRouter.get(
    "/myOrders/:orderId/details",
    isLoggedIn,
    ordersController.getOrderItemsById
  );
}

