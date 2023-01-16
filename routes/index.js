const authRouter = require('./auth')
const productRouter = require('./products')
const userRouter = require('./user')

module.exports = (app, passport) => {
    authRouter(app, passport);
    productRouter(app);
    userRouter(app);
}
