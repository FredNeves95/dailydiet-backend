import { Router } from 'express'
import { userController } from './controllers/UserController'
import { mealController } from './controllers/MealController'

export const routes = Router()

// Users
routes.get('/users', userController.index)
routes.get('/users/:id', userController.show)
routes.post('/users', userController.store)
routes.put('/users/:id', userController.update)
routes.delete('/users/:id', userController.delete)

// Meals
routes.get('/meals/user/:id', mealController.index)
routes.get('/meals/:id', mealController.show)
routes.post('/meals', mealController.store)
routes.put('/meals/:id', mealController.update)
routes.delete('/meals/:id', mealController.delete)
