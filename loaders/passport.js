const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUserById } = require("../helpers/users");
const { loginUser } = require("../helpers/auth");
const { getCartByUserId } = require("../helpers/carts");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());


  //determines what data from the user object should be stored in the session
  // stored as an object - req.session.passport.user
  passport.serializeUser(async (user, done) => {
    done(null, user.id);
  });


  // loads additional user info on every request 
  // data is attached to req.user object
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      const userCart = await getCartByUserId(id);
      user.cart_id = userCart[0].cart_id;
      done(null, user);

    } catch (err) {
      done (err);
    }
  });

  // Configure local strategy to be use for local login
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await loginUser({ email, password });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  return passport;
};
