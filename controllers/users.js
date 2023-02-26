const userHelpers = require("../helpers/users");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userHelpers.getAllUsers();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userHelpers.getUserById(req.user.id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    await userHelpers.updateUserById({
      username,
      password,
      email,
      userId: req.user.id,
    });

    res.status(200).json({
      message: "Successfully updated user" });
  } catch (err) {
    next(err);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await userHelpers.deleteUserById(req.user.id);

    res.status(200).json({ 
      message: "Successfully deleted user",
      deletedUser: {
        username: deletedUser.username,
        email: deletedUser.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
