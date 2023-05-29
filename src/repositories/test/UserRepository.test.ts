import { describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import { User } from '../@types/UserRepository'
import { randomUUID } from 'crypto'
import { userRepository } from '../UserRepository'

describe('User repository tests', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create a user when calling create method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'User',
      user_email: 'user@mail.com',
    }

    const response: User = await userRepository.create(user)
    const userName = response.user_name
    const userEmail = response.user_email

    expect(userName).toEqual(user.user_name)
    expect(userEmail).toEqual(user.user_email)
  })

  it('should list all users when calling findAll method', async () => {
    const firstUser: User = {
      id: randomUUID(),
      user_name: 'First User',
      user_email: 'first@mail.com',
    }

    await userRepository.create(firstUser)

    const secondUser: User = {
      id: randomUUID(),
      user_name: 'Second Uest',
      user_email: 'second@mail.com',
    }

    await userRepository.create(secondUser)

    const userList = await userRepository.findAll()

    expect(userList.length).toEqual(2)
  })

  it('should list a user when calling findById method', async () => {
    const firstUser: User = {
      id: randomUUID(),
      user_name: 'First User',
      user_email: 'first@mail.com',
    }

    const response = await userRepository.create(firstUser)

    const userName = response.user_name
    const userEmail = response.user_email

    const secondUser: User = {
      id: randomUUID(),
      user_name: 'Second Uest',
      user_email: 'second@mail.com',
    }

    await userRepository.create(secondUser)

    const id = response.id

    const user = (await userRepository.findById(id)) as User

    expect(userName).toEqual(user.user_name)
    expect(userEmail).toEqual(user.user_email)
  })

  it('should list a user when calling findByEmail method', async () => {
    const firstUser: User = {
      id: randomUUID(),
      user_name: 'First User',
      user_email: 'first@mail.com',
    }

    const response = await userRepository.create(firstUser)

    const userName = response.user_name
    const userEmail = response.user_email

    const secondUser: User = {
      id: randomUUID(),
      user_name: 'Second Uest',
      user_email: 'second@mail.com',
    }

    await userRepository.create(secondUser)

    const email = response.user_email

    const user = (await userRepository.findByEmail(email)) as User

    expect(userName).toEqual(user.user_name)
    expect(userEmail).toEqual(user.user_email)
  })

  it('should uptade a user when calling update method', async () => {
    const user: User = {
      id: randomUUID(),
      user_name: 'First User',
      user_email: 'first@mail.com',
    }

    const response = await userRepository.create(user)

    const id = response.id

    const newEmail = 'updatedfirst@mail.com'

    const updatedUser = await userRepository.update(id, {
      id,
      user_name: response.user_name,
      user_email: newEmail,
    })

    const userName = updatedUser.user_name
    const userEmail = updatedUser.user_email

    expect(userName).toEqual(user.user_name)
    expect(userEmail).toEqual(newEmail)
  })

  it('should delete a user when calling delete method', async () => {
    const firstUser: User = {
      id: randomUUID(),
      user_name: 'First User',
      user_email: 'first@mail.com',
    }

    const response = await userRepository.create(firstUser)

    const secondUser: User = {
      id: randomUUID(),
      user_name: 'Second Uest',
      user_email: 'second@mail.com',
    }

    await userRepository.create(secondUser)

    const userList = await userRepository.findAll()

    expect(userList.length).toEqual(2)

    const id = response.id

    await userRepository.delete(id)

    const newUserList = await userRepository.findAll()
    expect(newUserList.length).toEqual(1)
  })
})
