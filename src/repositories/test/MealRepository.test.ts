import { describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import { userRepository } from '../UserRepository'
import { User } from '../@types/UserRepository'
import { Meal } from '../@types/MealRepository'
import { mealRepository } from '../MealRepository'

describe('Meal repository tests', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should save a meal when calling create method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const newMeal: Meal = {
      id: randomUUID(),
      meal_name: 'jantar',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 19:30:00',
      user_id: id,
    }

    const meal: Meal = await mealRepository.create(newMeal)

    const mealName = meal.meal_name
    const mealDescription = meal.meal_description
    const mealDate = meal.meal_date
    const userId = meal.user_id
    const isDiet = !!meal.diet

    expect(mealName).toEqual(newMeal.meal_name)
    expect(mealDescription).toEqual(newMeal.meal_description)
    expect(mealDate).toEqual(newMeal.meal_date)
    expect(userId).toEqual(newMeal.user_id)
    expect(isDiet).toEqual(newMeal.diet)
  })

  it('should list all meal from user when calling findAll method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const firstMeal: Meal = {
      id: randomUUID(),
      meal_name: 'almoço',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 12:30:00',
      user_id: id,
    }

    await mealRepository.create(firstMeal)

    const secondMeal: Meal = {
      id: randomUUID(),
      meal_name: 'jantar',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 19:30:00',
      user_id: id,
    }

    await mealRepository.create(secondMeal)

    const meals = await mealRepository.findAll(id)

    expect(meals.length).toEqual(2)
  })

  it('should get metrics of meals from user when calling metrics method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const firstMeal: Meal = {
      id: randomUUID(),
      meal_name: 'almoço',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 12:30:00',
      user_id: id,
    }

    await mealRepository.create(firstMeal)

    const secondMeal: Meal = {
      id: randomUUID(),
      meal_name: 'jantar',
      meal_description: 'batata frita',
      diet: false,
      meal_date: '29/05/2023 19:30:00',
      user_id: id,
    }

    await mealRepository.create(secondMeal)

    const metrics = await mealRepository.metrics(id)

    expect(metrics.total).toEqual(2)
    expect(metrics.onDiet).toEqual(1)
    expect(metrics.offDiet).toEqual(1)
  })

  it('should delete meal from user when calling delete method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const firstMeal: Meal = {
      id: randomUUID(),
      meal_name: 'almoço',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 12:30:00',
      user_id: id,
    }

    const meal = await mealRepository.create(firstMeal)

    const secondMeal: Meal = {
      id: randomUUID(),
      meal_name: 'jantar',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 19:30:00',
      user_id: id,
    }

    await mealRepository.create(secondMeal)

    const meals = await mealRepository.findAll(id)

    expect(meals.length).toEqual(2)

    const mealId = meal.id

    await mealRepository.delete(mealId)

    const updatedMeals = await mealRepository.findAll(id)

    expect(updatedMeals.length).toEqual(1)
  })

  it('should get a meal from user when calling findById method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const firstMeal: Meal = {
      id: randomUUID(),
      meal_name: 'almoço',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 12:30:00',
      user_id: id,
    }

    const { id: mealId } = await mealRepository.create(firstMeal)

    const secondMeal: Meal = {
      id: randomUUID(),
      meal_name: 'jantar',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 19:30:00',
      user_id: id,
    }

    await mealRepository.create(secondMeal)

    const meal = (await mealRepository.findById(mealId)) as Meal

    const mealName = meal.meal_name
    const mealDescription = meal.meal_description
    const mealDate = meal.meal_date
    const userId = meal.user_id
    const isDiet = !!meal.diet

    expect(mealName).toEqual(firstMeal.meal_name)
    expect(mealDescription).toEqual(firstMeal.meal_description)
    expect(mealDate).toEqual(firstMeal.meal_date)
    expect(userId).toEqual(firstMeal.user_id)
    expect(isDiet).toEqual(firstMeal.diet)
  })

  it('should update a meal from user when calling update method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)

    const id = response.id

    const newMeal: Meal = {
      id: randomUUID(),
      meal_name: 'almoço',
      meal_description: 'arroz com feijão e bife',
      diet: true,
      meal_date: '29/05/2023 12:30:00',
      user_id: id,
    }

    const { id: mealId } = await mealRepository.create(newMeal)

    const updatedMeal = {
      ...newMeal,
      meal_name: 'Lanche da tarde',
      meal_description: 'Pão com ovo',
      meal_date: '19/05/2023 15:30:00',
    }

    const meal = await mealRepository.update(mealId, updatedMeal)

    const mealName = meal.meal_name
    const mealDescription = meal.meal_description
    const mealDate = meal.meal_date
    const userId = meal.user_id
    const isDiet = !!meal.diet

    expect(mealName).toEqual(updatedMeal.meal_name)
    expect(mealDescription).toEqual(updatedMeal.meal_description)
    expect(mealDate).toEqual(updatedMeal.meal_date)
    expect(userId).toEqual(updatedMeal.user_id)
    expect(isDiet).toEqual(updatedMeal.diet)
  })
})
