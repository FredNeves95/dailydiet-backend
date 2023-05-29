import { knex } from '../database'
import { Meal } from './@types/MealRepository'

class MealRepository {
  async findAll(id: string) {
    const meals = await knex('meals').where('user_id', id).select('*')
    return meals
  }

  async findById(id: string) {
    const meal = await knex('meals').where('id', id).first()
    return meal
  }

  async create(meal: Meal) {
    const newMeal = await knex('meals').insert(meal).returning('*')
    return newMeal
  }

  async update(id: string, meal: Meal) {
    const updatedMeal = await knex('meals')
      .where('id', id)
      .update(meal)
      .returning('*')

    return updatedMeal
  }

  async delete(id: string) {
    return await knex('meals').where('id', id).del()
  }

  async metrics(id: string) {
    const totalAmount = await knex('meals').where('user_id', id).count()

    const onDietAmount = await knex('meals')
      .where('user_id', id)
      .andWhere('diet', true)
      .count()

    const offDietAmount = await knex('meals')
      .where('user_id', id)
      .andWhere('diet', false)
      .count()

    const metrics = {
      total: totalAmount[0]['count(*)'],
      onDiet: onDietAmount[0]['count(*)'],
      offDiet: offDietAmount[0]['count(*)'],
    }

    return metrics
  }
}

export const mealRepository = new MealRepository()
