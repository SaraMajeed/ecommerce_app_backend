const pool = require("../db/db");


const getProducts = async () => {
    const products = await pool.query("SELECT * FROM product")
    return products.rows
}

const getProductsByCategory = async category => {
    const query = "SELECT * FROM product WHERE category = $1"

    const products = await pool.query(query, [category.toLowerCase()])

    return products.rows

}

const getProductByName = async name => {
    const query = "SELECT * FROM product WHERE name ILIKE '%'||$1||'%' ORDER BY name ASC"

    const products = await pool.query(query, [name.toLowerCase()])

    return products.rows

}


const getProductById = (req, res) => {
    const query = "SELECT * FROM product WHERE id = $1"

    const product = pool.query(query, [req.params.productId], (err, results) => {
        if (err) throw err;

        res.status(200).send(results.rows)
    })
}


module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductsByCategory,
};
