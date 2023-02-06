const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../helpers/users");


const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).send(users)
    } catch (err) {
        res.status(404);
        throw err;
    }
}

const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).send(user)
    } catch (err) {
        res.status(404);
        throw err;
    }
}

const updateUserByIdController = async (req, res) => {
    try {

        const {username, password, email} = req.body;
        
        const updatedUser = await updateUserById({username, password, email, userId: req.user});

        res.status(200).send(updatedUser)

    } catch (err) {
        res.status(404);
        throw err;
    }
}

const deleteUserByIdController = async (req, res) => {
    try {
        const deletedUser = await deleteUserById(req.user);

        res.status(200).send(deletedUser)

    } catch (err) {
        res.status(404);
        throw err;
    }
}

module.exports = {
    getAllUsersController,
    getUserByIdController,
    updateUserByIdController,
    deleteUserByIdController,
}