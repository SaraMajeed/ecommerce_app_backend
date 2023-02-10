const { Router } = require("express");
const {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} = require("../controllers/users");

const { isLoggedIn } = require("../middleware/authMiddleware");

const userRouter = Router();

module.exports = (app) => {
  app.use("/users", userRouter);

  userRouter.get("/", getAllUsersController); //admin only

  userRouter.get("/:id", isLoggedIn, getUserByIdController);

  userRouter.put("/:id", isLoggedIn, updateUserByIdController);

  userRouter.delete("/:id", isLoggedIn, deleteUserByIdController);

  

};
