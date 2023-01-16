const { getOrders, getOrdersById } = require('../helpers/orders')
const ordersRouter = require('express').Router({ mergeParams: true });

ordersRouter.get('/', getOrders)

ordersRouter.get('/:orderId', getOrdersById)

module.exports = ordersRouter;


