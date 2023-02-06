const { Router } = require("express");
const {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} = require("../controllers/users");

const { getUserById } = require('../helpers/users');

const userRouter = Router();
const ordersRouter = require("./orders");
const cartsRouter = require("./carts");

module.exports = (app) => {
  app.use("/users", userRouter);

  userRouter.get("/", getAllUsersController);

  userRouter.get("/:id", getUserByIdController);

  userRouter.put("/:id", updateUserByIdController);

  userRouter.delete("/:id", deleteUserByIdController);

  userRouter.param("id", async (req, res, next, id) => {
    try {
      let user = await getUserById(id);
      if (user) {
        req.user = user.id;
        next();
      } else {
        next(new Error("User does not exist!"));
      }
    } catch (err) {
      next(err);
    }
  });

  userRouter.use("/:id/orders", ordersRouter);

  userRouter.use("/:id/carts", cartsRouter);
};
