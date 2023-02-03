const pool = require("../db/db");

const getCarts = (req, res) => {
    const query = "SELECT * FROM cart"

    const carts = pool.query(query, (err, results) => {
        if (err) throw err;

        res.status(200).send(results.rows);
    })
}

const createCart = async id => {

    try {
        const newCart = await pool.query("INSERT INTO cart (user_id) VALUES ($1) RETURNING *", [id]);

        return newCart.rows

    } catch (err) {
        throw err
    }

}

const getCartById = (req, res) => {
    const query = "SELECT * FROM cart WHERE id = $1 AND user_id = $2"

    const userCart = pool.query(query, [req.params.cartId, req.user], (err, results) => {
        if (err) throw err;

        res.status(200).send(results.rows);
    })
}

const getProductsInCart = (req, res) => {
    const query = ""
}


module.exports = {
    getCarts,
    createCart,
    getCartById,
    getProductsInCart,
}