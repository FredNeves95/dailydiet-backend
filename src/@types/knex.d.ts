// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      user_name: string
      user_email: string
      user_phone: string
      created_at: string
    }

    meals: {
      id: string
      meal_name: string
      meal_description: string
      meal_date: string
      created_at: string
      user_id: string
    }
  }
}
