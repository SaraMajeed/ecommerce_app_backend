const app = require('./index')

const PORT = process.env.PORT || 4001;

// Start server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

