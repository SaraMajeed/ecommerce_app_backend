const pool = require("../db/db");
const express = require("express");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const { loginUser, registerUser } = require("../helpers/users");

module.exports = (app, passport) => {
  app.use("/auth", authRouter);

  authRouter.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const newUser = await registerUser({username, email, password})

      res.status(201).send(newUser);
    } catch (err) {
      throw err
    }
  });

  authRouter.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const { email, password } = req.body;
        console.log(email, password)

        const response = await loginUser({email, password});

        res.status(200).send(response);
      } catch (err) {
        next(err);
      }
    }
  );
};
