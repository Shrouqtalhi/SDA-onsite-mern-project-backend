import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import ApiError from '../errors/ApiError'

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    })
    next()
  } catch (error) {
    console.log('=======')
    const zodError = error
    if (zodError instanceof ZodError) {
      return next(ApiError.badRequestValidation(zodError.errors))
    }
    return next(ApiError.internal)
  }
}

export default validate
