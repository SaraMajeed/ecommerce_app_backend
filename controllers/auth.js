const authHelpers = require("../helpers/users");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await authHelpers.registerUser({ username, email, password });

    res.status(201).send(newUser[0]);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await authHelpers.loginUser({ email, password });

    res.status(200).send(`Logged in as ${response.username}`);
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send("Logged Out Successfully");
    // res.redirect("/auth/login");
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
