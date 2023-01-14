const pool = require("../db/db");

const getOrders = (req, res) => {
    const query = "SELECT date, total_price FROM orders WHERE users_id = $1 ORDER BY date;"

    const orders = pool.query(query, [req.params.id], (err, results) => {
        if(err) throw err;

        res.status(200).send(results.rows)
    })

}

const getOrdersById = (req, res) => {

    // console.log(req.params.orderId, req.params.id)

    //TODO: fix query

    const query = "SELECT product.name, product.description, product.price FROM orders, product, products_orders WHERE products_orders.orders_id  = orders.id AND product.id = products_orders.product_id AND orders.users_id = $1 AND product.id = $2;"

    const order = pool.query(query, [req.params.id, req.params.orderId], (err, results) => {
        if(err) throw err;

        res.status(200).send(results.rows)
    })

} 

module.exports = {
    getOrders,
    getOrdersById,
}