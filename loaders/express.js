const bodyParser = require("body-parser");
const session = require("express-session");

module.exports = (app) => {
  app.use(bodyParser.json());

  // Logging

  const morgan = require("morgan");

  // development logging (:method :url :status :response-time)
  // disable logging when testing
  app.use(
    morgan("dev", {
      skip: (req, res) => process.env.NODE_ENV === "test",
    })
  );

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
