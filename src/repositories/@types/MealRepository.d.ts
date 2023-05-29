export interface Meal {
  id: string
  meal_name: string
  meal_description: string
  meal_date: string
  diet: boolean
  created_at: string
  user_id: string
}

export interface MealBody extends Meal {
  diet: {
    value: boolean
  }
}
