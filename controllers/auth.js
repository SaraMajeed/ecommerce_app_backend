const { registerUser, loginUser } = require("../helpers/users");

const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await registerUser({ username, email, password });

    res.status(201).send(newUser[0]);
  } catch (err) {
    res.status(404);
    throw err;
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await loginUser({ email, password });

    res.status(200).send(`Logged in as ${response.username}`);
  } catch (err) {
    next(err);
  }
};

const logoutUserController = async (req, res) => {
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
  registerUserController,
  loginUserController,
  logoutUserController,
};
