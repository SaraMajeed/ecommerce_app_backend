const { Router } = require('express');
const { deserializeUser } = require('passport');
const { getAllUsers, getUserById, updateUserById, deleteUserById } = require('../helpers/users')
const userRouter = Router()
const ordersRouter = require('./orders')

module.exports = (app) => {

    app.use('/users', userRouter)

    userRouter.get('/', getAllUsers)

    userRouter.get('/:id', async (req, res) => {
        try {
            const user = await getUserById(req.params.id)

            res.send(user)

        } catch (err) {
            throw err;
        }
    })

    userRouter.put('/:id', updateUserById)

    userRouter.delete('/:id', async (req, res) => {
        try {
            const userToDelete = await deleteUserById(req.params.id)
            res.send(userToDelete)
        } catch (err) {
            throw err;
        }
    })

    userRouter.use('/:id/orders', ordersRouter)

}



