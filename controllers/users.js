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
    const user = await userHelpers.getUserById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const updatedUser = await userHelpers.updateUserById({
      username,
      password,
      email,
      userId: req.user,
    });

    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await userHelpers.deleteUserById(req.user);

    res.status(200).send(deletedUser);
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
