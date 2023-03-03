const pool = require("../db/db");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { createCart } = require("../helpers/carts");
const { getUserByEmail, encryptPassword } = require("./users");


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
    await createCart(newUser.rows[0].id);

    return newUser.rows;
  } catch (err) {
    throw err;
  }
};


const registerUser = async (data) => {
  const { username, email, password, admin } = data;

  if (!username || !email || !password) {
    throw createError(
      400,
      "Please enter all fields: username, email and password"
    );
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
  encryptPassword,
  getUserByEmail,
  registerUser,
  loginUser,
};
