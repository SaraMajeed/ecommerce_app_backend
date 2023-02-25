const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { loginUser, getUserById } = require("../helpers/users");
const { getCartByUserId } = require("../helpers/carts");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(async (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      const userCart = await getCartByUserId(id);
      user.cart_id = userCart[0].id;
      done(null, user);

    } catch (err) {
      done (err)
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
