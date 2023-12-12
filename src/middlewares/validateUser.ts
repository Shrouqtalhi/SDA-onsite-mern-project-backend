import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    firstName: zod.string().min(3),
    lastName: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(6),
  })

  try {
    const validatedUser = schema.parse(req.body)

    req.validatedUser = validatedUser
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }

    next(ApiError.internal('Something went wrong'))
  }
}

export function validateUserLogin(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  })

  try {
    const validateUserLogin = schema.parse(req.body)

    req.validateUserLogin = validateUserLogin
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }

    next(ApiError.internal('Something went wrong'))
  }
}
