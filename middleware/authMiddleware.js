const isLoggedIn = (req, res, next) => {
  try {
    if (req.user) {
      //if user is logged in
      next();
    } else {
      res
        .status(401)
        .json({ message: "You are not logged in. Please log in or register to continue." });
      // res.redirect('/auth/login')
    }
  } catch (err) {
    next(err);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.admin) {
      //if user is admin
      next();
    } else {
      res
      .status(401)
      .json({ message: "You are not authorised to view or edit this content!" });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
    isLoggedIn,
    isAdmin,
}