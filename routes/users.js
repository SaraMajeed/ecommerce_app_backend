const { Router } = require("express");
const usersController = require("../controllers/users");

const { isLoggedIn, isAdmin } = require("../middleware/authMiddleware");

const userRouter = Router();

module.exports = (app) => {
  app.use("/users", userRouter);

  userRouter.get("/", isLoggedIn, isAdmin, usersController.getAllUsers);

  userRouter.get("/myAccount", isLoggedIn, usersController.getUserById);

  userRouter.put("/myAccount", isLoggedIn, usersController.updateUserById);

  userRouter.delete("/myAccount", isLoggedIn, usersController.deleteUserById);

};
