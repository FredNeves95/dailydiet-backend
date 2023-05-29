import { knex } from '../database'
import { User } from './@types/UserRepository'

class UserRepository {
  async findAll() {
    const users = await knex('users').select('*')
    return users
  }

  async findById(id: string) {
    const user = await knex('users').where('id', id).first()
    return user
  }

  async findByEmail(email: string) {
    const user = await knex('users').where('user_email', email).first()
    return user
  }

  async create(user: User) {
    const newUser = await knex('users').insert(user).returning('*')
    return newUser
  }

  async update(id: string, user: User) {
    const updatedUser = await knex('users')
      .where('id', id)
      .update(user)
      .returning('*')

    return updatedUser
  }

  async delete(id: string) {
    const deletedUser = await knex('users').where('id', id).del()
    return deletedUser
  }
}

export const userRepository = new UserRepository()
