const { getOrders, getOrdersById, getProductsOrdersByOrderId } = require('../helpers/orders')
const ordersRouter = require('express').Router({ mergeParams: true });

ordersRouter.get('/', getOrders)

ordersRouter.get('/:orderId', getOrdersById)

ordersRouter.get('/:orderId/details',getProductsOrdersByOrderId )

module.exports = ordersRouter;


