const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders");

const { isLoggedIn } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app.use("/orders", ordersRouter);

  ordersRouter.get("/", ordersController.getAllOrders); // admin only

  ordersRouter.get("/:userId", isLoggedIn, ordersController.getUserOrders);

  ordersRouter.get(
    "/:userId/:orderId",
    isLoggedIn,
    ordersController.getOrdersById
  );

  ordersRouter.delete("/:userId/:orderId", ordersController.deleteOrder); //admin only

  ordersRouter.get(
    "/:userId/:orderId/details",
    isLoggedIn,
    ordersController.getOrderItemsById
  );
}

