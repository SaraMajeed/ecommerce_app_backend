const authHelpers = require("../helpers/users");
const createError = require("http-errors");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await authHelpers.registerUser({ username, email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await authHelpers.loginUser({ email, password });

    res.status(200).json({ message: `Logged in as ${response.username}` });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy();
    res.json({ message: "Logged Out Successfully" });
    // res.redirect("/auth/login");
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
