import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { Book, BookDocument } from '../models/book'
import ApiError from '../errors/ApiError'

// GET /api/books -> Get all books
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.find().populate('authorId')
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
    if (!book) {
      next(ApiError.badRequest(`book with id ${id} not found!`))
    }
    res.json({
      message: `Get book by id ${id}`,
      payload: book,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/books/:slug -> Get books by slug -> npm i slugify
// export const getBookBySlug = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // const book = await Book.find({ slug: req.params.slug })
//     // if (book.length === 0) {
//     //   next(ApiError.badRequest(`book not found!`))
//     // }
//     // res.json({
//     //   message: `Get book by slug`,
//     //   payload: book.length === 1 ? book[0] : book,
//     // })
//   } catch (error) {
//     next(error)
//   }
// }

// PORT /api/books -> Create new book
export const createNewBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check book already exists or not
    const { title, description, isAvailable, bookCopiesQty }: BookDocument = req.body
    const isExist = await Book.exists({ title: title })
    if (isExist) {
      next(ApiError.badRequest(`book already exist with this title`))
    }
    const book = new Book({
      title: title,
      description: description,
      isAvailable: isAvailable,
      bookCopiesQty: bookCopiesQty,
    })
    await book.save()

    res.status(201).json({
      message: 'New book created',
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/books -> delete a book
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const book = await Book.findByIdAndDelete(id)
    if (!book) {
      next(ApiError.badRequest(`Book with id ${id} not found!`))
    }
    res.json({
      message: `Book with id ${id} has been deleted`,
      payload: book,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/books -> delete a book
// export const deleteBookBySlug = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const book = await Book.findByIdAndDelete({ slug: req.params.slug })
//     console.log(book)
//     if (!book) {
//       next(ApiError.badRequest(`Book not found!`))
//     }
//     res.json({
//       message: `Book has been deleted`,
//       payload: book,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// PUT /api/books/:id -> Update a book
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const updatedBook: BookDocument = req.body
    const book = Book.findByIdAndUpdate(id, updatedBook, { new: true })
    if (!book) {
      next(ApiError.badRequest(`Book with id ${id} not found!`))
    }
    res.json({
      message: `Book with id ${id} has been updated`,
      payload: book,
    })
  } catch (error) {
    next(error)
  }
}
