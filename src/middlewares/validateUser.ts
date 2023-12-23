import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    firstName: zod
      .string({
        required_error: 'First Name is required !',
        invalid_type_error: 'First Name must be a string',
      })
      .min(3, 'First name must be more than 3 character'),
    lastName: zod
      .string({
        required_error: 'Last Name is required !',
        invalid_type_error: 'Last Name must be a string',
      })
      .min(3, 'Last name must be more than 3 character'),
    email: zod.string().email(),
    password: zod.string().min(6, 'password must be at least 6 character'),
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

// Forgot Password
export function validateForgotPassword(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    email: zod.string().email(),
  })

  try {
    const forgotUserPassword = schema.parse(req.body)

    req.forgotPassword = forgotUserPassword
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

// Reset Password
export function validateResetPassword(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    password: zod.string().min(6, 'password must be at least 6 character'),
    forgotPasswordCode: zod.string(),
  })

  try {
    const resetUserPassword = schema.parse(req.body)

    req.resetPassword = resetUserPassword
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

// Login
export function validateUserLogin(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, 'Password must be more than 6'),
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
