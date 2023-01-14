const { getOrders, getOrdersById } = require('../helpers/orders')
const ordersRouter = require('express').Router({ mergeParams: true });

// TODO: route needs fixing

module.exports = (app) => {

    app.use('/orders', ordersRouter)
    
    ordersRouter.get('/', getOrders)

    ordersRouter.get('/:orderId', getOrdersById)

}


