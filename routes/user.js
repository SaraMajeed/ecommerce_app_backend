const { Router } = require('express');
const { getAllUsers, getUserById, updateUserById, deleteUser } = require('../helpers/users')
const userRouter = Router()
const ordersRouter = require('./orders')

module.exports = (app) => {

    app.use('/users', userRouter)

    userRouter.get('/', getAllUsers)

    userRouter.get('/:id', getUserById)

    userRouter.put('/:id', updateUserById)

    userRouter.delete('/:id', deleteUser)

    userRouter.use('/:id/orders', ordersRouter)

}



