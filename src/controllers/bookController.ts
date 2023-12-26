import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { Book, BookDocument } from '../models/book'
import Author from '../models/author'

import ApiError from '../errors/ApiError'
import { BookSchemaType } from '../zod/bookSchema'
import mongoose from 'mongoose'

type FilterByTitle = {
  title?: { $regex: RegExp }
  authorId?: string
  sortByPrice?: 'asc' | 'desc'
}
export default class bookController {
  // GET /api/books -> Get all books
  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const title = req.query.title

      const filters: FilterByTitle = {}

      let page = Number(req.query.page) || 1
      const perPage = Number(req.query.perPage) || 8
      const totalBooks = await Book.countDocuments()
      const totalPage = Math.ceil(totalBooks / perPage)
      if (title && typeof title === 'string') {
        filters.title = { $regex: new RegExp(title, 'i') }
      }

      if (page > totalPage) {
        page = totalPage
      }

      const books = await Book.find(filters)
        // .sort(sortOptions)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate('authorId')

      res.json({
        page,
        totalPage,
        totalBooks,
        message: 'Get All Books',
        payload: books,
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
  // GET /api/books/:id -> Get books by id
  async getBookById(req: Request, res: Response, next: NextFunction) {
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
      if (error instanceof mongoose.Error.CastError) {
        const error = next(ApiError.badRequest(`Id formate is not valid!`))
        next(error)
      } else {
        next(error)
      }
    }
  }
  // PORT /api/books -> Create new book
  async createNewBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { image, title, description, bookCopiesQty, price } = req.body as BookDocument
      // : BookDocument
      // req.body as BookSchemaType

      if (!image || !title || !description || bookCopiesQty === undefined || price === undefined) {
        next(
          ApiError.badRequest(`Invalid request: All values should be provided and not be empty.`)
        )
        return
      }
      // Check book already exists or not
      const isExist = await Book.exists({ title: title })
      if (isExist) {
        next(ApiError.badRequest(`book already exist with this title`))
        return
      }

      const book = new Book({
        // image: req.file?.path,
        image,
        title,
        description,
        // isAvailable,
        bookCopiesQty,
        price,
      })

      await book.save()

      res.status(201).json({
        message: 'New book created',
        payload: book,
      })
    } catch (error) {
      console.log(error)
      next(error)
      return
    }
  }
  // DELETE /api/books -> delete a book
  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id
      const book = await Book.findByIdAndDelete(id)
      if (!book) {
        next(ApiError.badRequest(`Book with id ${id} not found!`))
        return
      }
      res.json({
        message: `Book with id ${id} has been deleted`,
        payload: book,
      })
    } catch (error) {
      next(error)
    }
  }
  // PUT /api/books/:id -> Update a book
  async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id
      const updatedBook: BookDocument = req.body
      const book = await Book.findByIdAndUpdate(id, updatedBook, { new: true })
      if (!book) {
        next(ApiError.badRequest(`Book with id ${id} not found!`))
        return
      }
      res.json({
        message: `Book with id ${id} has been updated`,
        payload: book,
      })
    } catch (error) {
      next(error)
    }
  }

  async addAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, authorsId } = req.body
      const book = await Book.findByIdAndUpdate(
        { _id: bookId },
        { $push: { authors: authorsId } },
        { new: true }
      )
      await Promise.all(
        authorsId.map(
          async (authorId: String) =>
            await Author.updateOne({ _id: authorId }, { $push: { books: [bookId] } })
        )
      )
      res.json({
        message: 'Add Author to books',
        payload: book,
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
