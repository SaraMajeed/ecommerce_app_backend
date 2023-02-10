const express = require("express");
const authRouter = express.Router();

const {
  registerUserController,
  loginUserController,
  logoutUserController,
} = require("../controllers/auth");

const { isLoggedIn } = require("../middleware/authMiddleware");

module.exports = (app, passport) => {
  app.use("/auth", authRouter); 

  authRouter.post("/register", registerUserController);

  authRouter.post(
    "/login",
    passport.authenticate("local"),
    loginUserController
  );

  authRouter.post("/logout", isLoggedIn, logoutUserController);
};
