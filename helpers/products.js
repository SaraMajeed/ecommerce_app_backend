const pool = require("../db/db");

const getProducts = async () => {
  try {
    const products = await pool.query("SELECT * FROM product");

    if (products.rows?.length) {
      return products.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getProductsByCategory = async (category) => {
  try {
    const query = "SELECT * FROM product WHERE category = $1";

    const products = await pool.query(query, [category.toLowerCase()]);

    if (products.rows?.length) {
      return products.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getProductByName = async (name) => {
  try {
    const query =
      "SELECT * FROM product WHERE name ILIKE '%'||$1||'%' ORDER BY name ASC";

    const products = await pool.query(query, [name.toLowerCase()]);

    if (products.rows?.length) {
      return products.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const getProductById = async (id) => {
  try {
    const query = "SELECT * FROM product WHERE id = $1";

    const product = pool.query(query, [id]);

    if (product.rows?.length) {
      return product.rows;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductsByCategory,
};
