const bodyParser = require("body-parser");
const session = require("express-session");

module.exports = (app) => {
  app.use(bodyParser.json());

  // Create a session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
      },
    })
  );

  return app;
};
