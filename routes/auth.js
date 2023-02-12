const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/auth");

const { isLoggedIn } = require("../middleware/authMiddleware");

module.exports = (app, passport) => {
  app.use("/auth", authRouter); 

  authRouter.post("/register", authController.registerUser);

  authRouter.post(
    "/login",
    passport.authenticate("local"),
    authController.loginUser
  );

  authRouter.post("/logout", isLoggedIn, authController.logoutUser);
};
