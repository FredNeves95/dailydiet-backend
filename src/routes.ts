import { Router } from 'express'
import { userController } from './controllers/UserController'

export const routes = Router()

// Users

routes.get('/users', userController.index)
routes.get('/users/:id', userController.show)
routes.post('/users', userController.store)
routes.put('/users/:id', userController.update)
routes.delete('/users/:id', userController.delete)
