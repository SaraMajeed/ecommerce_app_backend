const pool = require("../db/db");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { createCart} = require("../helpers/carts");

const encryptPassword = async (password) => {
  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

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
  const user = await pool.query("SELECT id, username, email, admin FROM users WHERE id = $1", [userId]);

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
    const userToDelete = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    return user;
  }
  return null;
};

const createUser = async (data) => {
  try {
    const { username, email, password, admin } = data;

    const hashedPassword = await encryptPassword(password);

    const insert = {
      query:
        "INSERT INTO users (username, password, email, admin) VALUES ($1, $2, $3, COALESCE($4, false)) RETURNING *",
      values: [username, hashedPassword, email, admin],
    };

    // Insert user data into users table
    const newUser = await pool.query(insert.query, insert.values);

    // Create a cart for the new user
    const newCart = await createCart(newUser.rows[0].id);

    return newUser.rows;
  } catch (err) {
    throw err;
  }
};

const registerUser = async (data) => {

  const { username, email, password, admin } = data;

  if(!username || !email || !password) {
    throw createError(400, "Please enter all fields: username, email and password");
  }

  const userExists = await getUserByEmail(email);

  if (userExists) {
    throw createError(409, "Email already in use");
  }

  return await createUser({ username, email, password, admin });
 
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await getUserByEmail(email);

  if (!user) {
    throw createError(401, "Incorrect email or password");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw createError(401, "Incorrect email or password");
  }

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByEmail,
  deleteUserById,
  registerUser,
  loginUser,
};
