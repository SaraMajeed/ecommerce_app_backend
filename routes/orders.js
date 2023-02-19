const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders");

const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", isLoggedIn, isAdmin, ordersController.getAllOrders);

  ordersRouter.get("/:userId", isLoggedIn, ordersController.getUserOrders);

  ordersRouter.get(
    "/:userId/:orderId",
    isLoggedIn,
    ordersController.getOrdersById
  );

  ordersRouter.delete("/:userId/:orderId", isLoggedIn, isAdmin, ordersController.deleteOrder); 

  ordersRouter.get(
    "/:userId/:orderId/details",
    isLoggedIn,
    ordersController.getOrderItemsById
  );
}

