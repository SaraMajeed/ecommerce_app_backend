const pool = require("../db/db");

const getProducts = async () => {
  try {
    const products = await pool.query("SELECT * FROM product ORDER BY id");

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

    const product = await pool.query(query, [id]);

    if (product.rows?.length) {
      return product.rows[0];
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const createNewProduct = async (data) => {
    try {
        const { name, description, price, category } = data;

        const insertQuery = {
          query:
            "INSERT INTO product (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *",
          values: [name, description, price, category],
        };

        const newProduct = await pool.query(insertQuery.query, insertQuery.values);

        return newProduct.rows;

    } catch (err) {
        throw err;
    } 
}

const updateProductById = async (data) => {
  try {
    const { name, description, price, category, productId } = data;

    const updateQuery = {
      query:
        "UPDATE product SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *",
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

    return "Cannot update! Product does not exist!";
  } catch (err) {
    throw err;
  }
};

const deleteProductById = async (id) => {
  try {

    const productExists = await getProductById(id);

    if(productExists) {
        const query = "DELETE FROM product WHERE id = $1 RETURNING *";

        const deletedProduct = await pool.query(query, [id]);

        return deletedProduct.rows;
    }

    return "Cannot delete! Product does not exist!";


  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductsByCategory,
  updateProductById,
  deleteProductById,
  createNewProduct
};
