const pool = require("../db/db");

const getAllUsers = async () => {
  const users = await pool.query(
    "SELECT id, username, email, admin FROM users"
  );

  if (users.rows?.length) {
    return users.rows;
  }

  return null;
};

const getUserById = async (userId) => {
  const user = await pool.query(
    "SELECT id, username, email, admin FROM users WHERE id = $1",
    [userId]
  );

  if (user.rows?.length) {
    return user.rows[0];
  }

  return null;
};

const updateUserById = async (data) => {
  const { username, password, email, userId } = data;

  const hashedPassword = await encryptPassword(password);

  const updateQuery = {
    query:
      "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING username, email",
    values: [username, hashedPassword, email, userId],
  };

  const updatedUser = await pool.query(updateQuery.query, updateQuery.values);

  return updatedUser.rows;
};

const getUserByEmail = async (email) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows?.length) {
      return user.rows[0];
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if (user) {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    return user;
  }
  return null;
};

const encryptPassword = async (password) => {
  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByEmail,
  deleteUserById,
  encryptPassword
};
