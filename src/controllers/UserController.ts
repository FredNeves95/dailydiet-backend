import { Request, Response } from 'express'
import { userRepository } from '../repositories/UserRepository'
import { User } from '../repositories/@types/UserRepository'
import { randomUUID } from 'crypto'
import { isValidUUID } from '../utils/isValidUUID'

class UserController {
  async index(request: Request, response: Response) {
    const users = await userRepository.findAll()

    if (!users.length) {
      return response
        .status(404)
        .json({ message: 'No users registered in database' })
    }

    response.status(200).json({ users })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const user = await userRepository.findById(id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    return response.status(200).json({ user })
  }

  async store(request: Request, response: Response) {
    const userData: User = request.body

    const userName = userData.user_name
    const userEmail = userData.user_email

    if (!userName) {
      return response.status(400).json({ message: 'Name is required' })
    }

    if (!userEmail) {
      return response.status(400).json({ message: 'Email is required' })
    }

    const isEmailAlreadyInUse = await userRepository.findByEmail(userEmail)

    if (isEmailAlreadyInUse) {
      return response
        .status(400)
        .json({ message: 'This email is already in use' })
    }

    const newUser = {
      ...userData,
      id: randomUUID(),
    }

    const user = await userRepository.create(newUser)

    return response.status(201).json(user)
  }

  async update(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const user = await userRepository.findById(id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    const userData = request.body

    const userEmail = userData.user_email

    if (userEmail) {
      const isEmailAlreadyInUse = await userRepository.findByEmail(userEmail)

      if (isEmailAlreadyInUse) {
        return response
          .status(400)
          .json({ message: 'This email is already in use' })
      }
    }

    const updatedUserData = {
      ...user,
      ...userData,
    }

    const updatedUser = await userRepository.update(id, updatedUserData)

    return response.status(200).json({ user: updatedUser })
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    if (!isValidUUID(id)) {
      return response.status(400).json({ message: 'Invalid ID' })
    }

    const user = await userRepository.findById(id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    await userRepository.delete(id)
    return response.sendStatus(204)
  }
}

export const userController = new UserController()
