const { Router } = require("express");
const usersController = require("../controllers/users");

const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

const userRouter = Router();

module.exports = (app) => {
  app.use("/users", isLoggedIn, userRouter);

  userRouter.get("/", isAdmin, usersController.getAllUsers);

  userRouter.get("/myAccount", usersController.getUserById);

  userRouter.put("/myAccount", usersController.updateUserById);

  userRouter.delete("/myAccount", usersController.deleteUserById);
};
