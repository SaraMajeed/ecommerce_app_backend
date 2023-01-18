const pool = require("../db/db");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

const encryptPassword = async (password) => {
  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const getAllUsers = (req, res) => {
  const users = pool.query("SELECT * FROM users", (err, results) => {
    if (err) throw err; 
    res.status(200).send(results.rows);
  });
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

const updateUserById = async (req, res) => {
  const { username, password, email } = req.body;

  const updateQuery = `UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING username, email `;

  const hashedPassword = await encryptPassword(password);
  // console.log(hashedPassword);

  pool.query(
    updateQuery,
    [username, hashedPassword, email, req.params.id],
    (err, results) => {
      if (err) throw err;

      res.send(results.rows);
    }
  );
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
      const userToDelete = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
      );
    } else {
      return null;
    }

    return user;
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

    const newUser = await pool.query(insert.query, insert.values);

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

    // console.log(user)
    return user;
  } catch (err) {
    throw createError(500, err)
  }
}

const isLoggedIn = (req, res, next) => {
  try {
    if(req.user) { //if user is logged in
      next()
    } else {
      console.log('not logged in')
      res.redirect('/auth/login')
    }
  } catch (err) {
    throw err;
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
  isLoggedIn,
};
