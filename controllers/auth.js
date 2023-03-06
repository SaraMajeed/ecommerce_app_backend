const authHelpers = require("../helpers/auth");

const registerUser = async (req, res, next) => {
  try {
    await authHelpers.registerUser(req.body);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const response = await authHelpers.loginUser(req.body);

    res.status(200).json({ message: `Logged in as ${response.username}` });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ message: "Logged Out Successfully" });
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
