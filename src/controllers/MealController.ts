import { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import { mealRepository } from '../repositories/MealRepository'
import { isValidUUID } from '../utils/isValidUUID'
import { MealBody } from '../repositories/@types/MealRepository'
import { userRepository } from '../repositories/UserRepository'

class MealController {
  async index(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const user = userRepository.findById(id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    const meals = await mealRepository.findAll(id)

    if (!meals.length) {
      return response
        .status(404)
        .json({ message: 'No meals registered in database' })
    }

    response.status(200).json({ meals })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const meal = await mealRepository.findById(id)

    if (!meal) {
      return response.status(404).json({ message: 'meal not found' })
    }

    return response.status(200).json({ meal })
  }

  async store(request: Request, response: Response) {
    const meal: MealBody = request.body

    const mealName = meal.meal_name
    const mealDescription = meal.meal_description
    const mealDate = meal.meal_date
    const diet = meal.diet
    const userId = meal.user_id

    if (!mealName) {
      return response.status(400).json({ message: 'Name is required' })
    }

    if (!mealDescription) {
      return response.status(400).json({ message: 'Description is required' })
    }

    if (!mealDate) {
      return response.status(400).json({ message: 'Date is required' })
    }

    if (!diet) {
      return response.status(400).json({ message: 'Diet is required' })
    }

    if (!userId) {
      return response.status(400).json({ message: 'User id is required' })
    }

    const newMealData = {
      ...meal,
      diet: diet.value,
      id: randomUUID(),
    }

    const newMeal = await mealRepository.create(newMealData)

    return response.status(201).json(newMeal)
  }

  async update(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const meal = await mealRepository.findById(id)

    if (!meal) {
      return response.status(404).json({ message: 'Meal not found' })
    }

    const mealData = request.body

    const updatedMealData = {
      ...meal,
      ...mealData,
    }

    const updatedMeal = await mealRepository.update(id, updatedMealData)

    return response.status(200).json({ meal: updatedMeal })
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const meal = await mealRepository.findById(id)

    if (!meal) {
      return response.status(404).json({ message: 'Meal not found' })
    }
    await mealRepository.delete(id)
    return response.sendStatus(204)
  }
}

export const mealController = new MealController()
