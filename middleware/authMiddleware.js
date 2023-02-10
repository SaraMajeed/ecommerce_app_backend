const isLoggedIn = (req, res, next) => {
  try {
    if (req.user) {
      //if user is logged in
      next();
    } else {
      res
        .status(401)
        .send("You are not logged in. Please log in or register to continue.");
      // res.redirect('/auth/login')
    }
  } catch (err) {
    throw err;
  }
};


// TODO: isAdmin



module.exports = {
    isLoggedIn,
}