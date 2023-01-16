const express = require("express");
const app = express();

const loaders = require("./loaders");

// Init application loaders
loaders(app);


module.exports = app;
