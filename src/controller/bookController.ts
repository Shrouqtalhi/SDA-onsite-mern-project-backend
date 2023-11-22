import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { Book } from '../models/book'

// GET /api/books -> Get all books
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.find()
    res.json({
      message: 'Get All Books',
      //   payload: book,
    })
  } catch (error) {
    next(error)
  }
}
