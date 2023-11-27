import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import ApiError from '../errors/ApiError'

class UserController {
  // GET /users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (error) {
      next(ApiError.internal('Internal Server Error'))
    }
  }

  // GET /users/:id
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id

    try {
      const user = await User.findById(userId)

      if (!user) {
        return next(ApiError.badRequest('User not found'))
      }

      res.json(user)
    } catch (error) {
      next(ApiError.internal('Internal Server Error'))
    }
  }

  // POST /users
  static async createUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, role } = req.body

    try {
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role,
      })

      const savedUser = await newUser.save()
      res.status(201).json(savedUser)
    } catch (error) {
      next(ApiError.internal('Internal Server Error'))
    }
  }

  // PUT /users/:id
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id
    const { firstName, lastName, email, password, role } = req.body

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, email, password, role },
        { new: true }
      )

      if (!user) {
        return next(ApiError.badRequest('User not found'))
      }

      res.json(user)
    } catch (error) {
      next(ApiError.internal('Internal Server Error'))
    }
  }

  // DELETE /users/:id
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id

    try {
      const deletedUser = await User.findByIdAndDelete(userId)

      if (!deletedUser) {
        return next(ApiError.badRequest('User not found'))
      }

      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      next(ApiError.internal('Internal Server Error'))
    }
  }
}

export default UserController
