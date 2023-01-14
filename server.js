const express = require('express')
const app = express()

const loaders = require('./loaders')

const PORT = process.env.PORT || 4001;

// Init application loaders
loaders(app)


// Start server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


module.exports = app;
