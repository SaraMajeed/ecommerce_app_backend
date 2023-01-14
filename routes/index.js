const authRouter = require('./auth')
const ordersRouter = require('./orders')
const productRouter = require('./products')
const userRouter = require('./user')

module.exports = (app, passport) => {
    authRouter(app, passport);
    ordersRouter(app);
    productRouter(app);
    userRouter(app);
}
