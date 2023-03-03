const { Client } = require("pg");

(async () => {

  const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            admin BOOLEAN NOT NULL
        );
    `;

  const productsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(255) NOT NULL,
            price NUMERIC(12,2) NOT NULL,
            category VARCHAR(50) NOT NULL
        );
    `;

  const cartsTable = `
        CREATE TABLEIF NOT EXISTS carts (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            user_id INTEGER NOT NULL UNIQUE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
  const ordersTable = `
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT NOW(),
            total_price NUMERIC(12,2) NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
  const orderItemsTable = `
        CREATE TABLE orderItems (
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
    `;

  const cartItemsTable = `
        CREATE TABLE cartItems (
            cart_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
    `;

  try {
    const db = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });

    await db.connect();

    // Creates table in database
    await db.query(usersTable);
    await db.query(productsTable);
    await db.query(cartsTable);
    await db.query(ordersTable);
    await db.query(orderItemsTable);
    await db.query(cartItemsTable);

    await db.end();
  } catch (err) {
    console.log("ERROR CREATING DATABASE: ", err);
  }
})();
