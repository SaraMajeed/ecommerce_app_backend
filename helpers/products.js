const pool = require("../db/db");
const createError = require("http-errors");

const getProducts = async () => {
  const products = await pool.query("SELECT * FROM products ORDER BY id");

  if (products.rows?.length) {
    return products.rows;
  }

  return null;
};

const getProductsByCategory = async (category) => {
  const query = "SELECT * FROM products WHERE category = $1";

  const products = await pool.query(query, [category.toLowerCase()]);

  if (products.rows?.length) {
    return products.rows;
  }

  return null;
};

const getProductByName = async (name) => {
  const query =
    "SELECT * FROM products WHERE name ILIKE '%'||$1||'%' ORDER BY name ASC";

  const products = await pool.query(query, [name.toLowerCase()]);

  if (products.rows?.length) {
    return products.rows;
  }

  return null;
};

const getProductById = async (productId) => {
  const query = "SELECT * FROM products WHERE id = $1";

  const product = await pool.query(query, [productId]);

  if (product.rows?.length) {
    return product.rows[0];
  }

  throw createError(404, "Product not found with id: " + productId);
};

const createNewProduct = async (data) => {
  const { name, description, price, category } = data;

  if (!name || !description || !price || !category) {
    throw createError(
      400,
      "Please provide all fields: name, description, price, category"
    );
  }

  const insertQuery = {
    query:
      "INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [name, description, price, category],
  };

  const newProduct = await pool.query(insertQuery.query, insertQuery.values);

  // @SaraMajeed
  // we should only get one row back as we're only inserting one thing,
  // so return row 1.
  return newProduct.rows[0];
};

const updateProductById = async (data) => {
  const { name, description, price, category, productId } = data;

  if (!name || !description || !price || !category) {
    throw createError(
      400,
      "Please provide all fields: name, description, price, category"
    );
  }

  const updateQuery = {
    query:
      "UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *",
    values: [name, description, price, category, productId],
  };

  // check if product exists before updating
  const productExists = await getProductById(productId);

  if (productExists) {
    const updatedProduct = await pool.query(
      updateQuery.query,
      updateQuery.values
    );
    return updatedProduct.rows[0];
  }
};

const deleteProductById = async (productId) => {
  const productExists = await getProductById(productId);

  if (productExists) {
    const query = "DELETE FROM products WHERE id = $1 RETURNING *";

    const deletedProduct = await pool.query(query, [productId]);

    return deletedProduct.rows[0];
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductsByCategory,
  updateProductById,
  deleteProductById,
  createNewProduct,
};
