const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { loginUser } = require("../helpers/users");
const { getCartByUserId } = require("../helpers/carts");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(async (user, done) => {
    // add cart id to user object
    const userCart = await getCartByUserId(user.id);
    user.cartId = userCart[0].id
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
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
