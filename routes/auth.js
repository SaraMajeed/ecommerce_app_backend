const pool = require("../db/db");
const express = require("express");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const { loginUser } = require("../helpers/users");

module.exports = (app, passport) => {
  app.use("/auth", authRouter);

  authRouter.post("/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;

      //generate salt
      const salt = await bcrypt.genSalt(10);
      //hash password
      const hashedPassword = await bcrypt.hash(password, salt);

      // add user to db
      const newUser = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, email]
      );

      res.status(201).send(newUser.rows);
    } catch (err) {
      if (
        err.message ==
        'duplicate key value violates unique constraint "users_email_key"'
      ) {
        res.send("User already exists");
      } else {
        res.send(err.message);
      }
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
