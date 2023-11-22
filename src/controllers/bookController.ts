import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { Book } from '../models/book'

// GET /api/books -> Get all books
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.find()
    res.json({
      message: 'Get All Books',
      payload: book,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/books/:id -> Get books by id
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const book = await Book.findById(id)
    res.json({
      message: `Get book by id ${id}`,
      payload: book,
    })
  } catch (error) {
    next(error)
  }
}
