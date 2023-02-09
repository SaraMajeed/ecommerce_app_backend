const authRouter = require('./auth')
const productRouter = require('./products')
const userRouter = require('./users')
const cartRouter = require('./carts')

module.exports = (app, passport) => {
    authRouter(app, passport);
    productRouter(app);
    userRouter(app);
    cartRouter(app);
}
