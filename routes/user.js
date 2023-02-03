const { Router } = require('express');
const { getAllUsers, getUserById, updateUserById, deleteUserById, getUserByEmail } = require('../helpers/users')
const userRouter = Router()
const ordersRouter = require('./orders')
const cartsRouter = require('./carts')

module.exports = (app) => {

    app.use('/users', userRouter)

    userRouter.get('/', getAllUsers)

    userRouter.get('/:id', async (req, res) => {
        try {
            const user = await getUserById(req.user)
            res.send(user)

        } catch (err) {
            throw err;
        }
    })

    userRouter.put('/:id', updateUserById)

    userRouter.delete('/:id', async (req, res) => {
        try {
            const userToDelete = await deleteUserById(req.user)
            res.send(userToDelete)
        } catch (err) {
            throw err;
        }
    })

    userRouter.param ('id', async (req, res, next, id) => {
        try {
            let user = await getUserById(id);
            if(user) {
                req.user = user.id
                next()
            } else {
                next (new Error('User does not exist!'))
            }
        } catch (err) {
            next(err)
        }
    }) 

    userRouter.use('/:id/orders', ordersRouter);
    
    userRouter.use("/:id/carts", cartsRouter);

}



