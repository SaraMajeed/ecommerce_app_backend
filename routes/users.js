const { Router } = require("express");
const {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
} = require("../controllers/users");



const userRouter = Router();

module.exports = (app) => {
  app.use("/users", userRouter);

  userRouter.get("/", getAllUsersController);

  userRouter.get("/:id", getUserByIdController);

  userRouter.put("/:id", updateUserByIdController);

  userRouter.delete("/:id", deleteUserByIdController);

  

};
