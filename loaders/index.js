const expressLoader = require("./express");
const passportLoader = require("./passport");
const routeLoader = require("../routes");

module.exports = async (app) => {
  //Load Express middleware
  const expressApp = await expressLoader(app);

  //Load Passport middleware
  const passport = await passportLoader(expressApp);

  //Load API route handlers
  routeLoader(app, passport);

  ///Error Handler -- called when errors are thrown to next()
  app.use((err, req, res, next) => {
    let { message, status } = err;
    status = err.status || 500;

    console.log(err);
    return res.status(status).send({ message });
  });
};
