const pool = require("../db/db");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { createCart, deleteCart } = require('../helpers/carts')

const encryptPassword = async (password) => {
  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const getAllUsers = async () => {

  try {
    const users = await pool.query("SELECT * FROM users")

    if (users.rows?.length){
      return users.rows;
    }

    return null;

  } catch (err) {
    throw err;
  }
};

const getUserById = async (id) => {

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]);

    if(user.rows?.length){
      return user.rows[0] 
    } 

    return null;

  } catch (err) {
    throw err;
  }

  
};

const updateUserById = async (data) => {

  try {
    const { username, password, email, userId } = data;

    const hashedPassword = await encryptPassword(password);

    const updateQuery = {
      query: "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING username, email",
      values: [username, hashedPassword, email, userId]
    }

    const updatedUser = await pool.query(updateQuery.query, updateQuery.values);
      
    return updatedUser.rows;
  } catch (err) {
    throw err;
  }

};

const getUserByEmail = async (email) => {

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if(user.rows?.length){
      return user.rows[0];
    }
    return null

  } catch (err) {
    throw err;
  }

}

const deleteUserById = async (id) => {

  try {

    const user = await getUserById(id)
    
    if(user){

      // delete the user's cart before deleting the user to avoid foreign key contraint violation
      const deleteUserCart = await deleteCart(id);

      const userToDelete = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
      );

      return `Successfully deleted user: 
        username: ${user.username}, 
        email: ${user.email}
      `
    } 
    return null; 

  } catch (err) {
    throw err
  }
}

const createUser = async (data) => {

  try {
    const { username, email, password } = data

    const hashedPassword = await encryptPassword(password)

    const insert = {
      query: "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
      values: [username, hashedPassword, email]
    }; 

    // Insert user data into users table
    const newUser = await pool.query(insert.query, insert.values);

    // Create a cart for the new user
    const newCart = await createCart(newUser.rows[0].id)

    return newUser.rows

  } catch (err) {
    throw err
  }
}

const registerUser = async (data) => {

  try {
    let response; 
    const { username, email, password } = data;
    const userExists = await getUserByEmail(email);

    if(userExists){
      response =  "User already exists"
    } else {
      response = await createUser({ username, email, password });
    }

    return response

  } catch (err) {
    throw err
  }
}



const loginUser = async (data) => {

  const { email, password } = data;
  
  try {
    
    const user = await getUserByEmail(email)

    if(!user) {
      throw createError(401, 'Incorrect username or password');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if(!passwordIsValid){
      throw createError(401, 'Incorrect username or password');
    }

    return user;
  } catch (err) {
    throw createError(500, err)
  }
}




module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByEmail,
  deleteUserById,
  registerUser,
  loginUser,
}; 
