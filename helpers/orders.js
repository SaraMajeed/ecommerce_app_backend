const pool = require("../db/db");

const getOrders = (req, res) => {
    const query = "SELECT orders.id, orders.user_id, users.email, orders.total_price FROM orders JOIN users ON users.id = orders.user_id AND orders.user_id = $1"

    const orders = pool.query(query, [req.user], (err, results) => {
        if(err) throw err;

        res.status(200).send(results.rows)
    }) 
}

const getOrdersById = (req, res) => {

    const query = "SELECT * FROM orders WHERE id = $1"

    const order = pool.query(query, [req.params.orderId], (err, results) => {
        if(err) throw err;

        res.status(200).send(results.rows)
    })
} 

const getProductsOrdersByOrderId = (req, res) => {
    const query = "SELECT product.id, product.name, product.description, product.category, products_orders.quantity, product.price AS price_per_unit FROM product JOIN products_orders ON products_orders.product_id = product.id WHERE orders_id = $1 ORDER BY product.id"

    const orderDetails = pool.query(query, [req.params.orderId], (err, results) => {
        if (err) throw err;

        res.status(200).send(results.rows)
    })
}

module.exports = {
    getOrders,
    getOrdersById,
    getProductsOrdersByOrderId,
}