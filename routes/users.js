const { Router } = require("express");
const usersController = require("../controllers/users");

const { isLoggedIn } = require("../middleware/authMiddleware");

const userRouter = Router();

module.exports = (app) => {
  app.use("/users", userRouter);

  userRouter.get("/", usersController.getAllUsers); //admin only

  userRouter.get("/:id", isLoggedIn, usersController.getUserById);

  userRouter.put("/:id", isLoggedIn, usersController.updateUserById);

  userRouter.delete("/:id", isLoggedIn, usersController.deleteUserById);

};
