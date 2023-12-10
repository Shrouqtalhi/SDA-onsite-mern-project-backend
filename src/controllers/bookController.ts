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
type SortOption = {
  sortByPrice?: 'asc' | 'desc' | { price: number }
}

export default class bookController {
  // GET /api/books -> Get all books
  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const title = req.query.title
      const author = req.query.author
      const sortByPrice = req.query.sort

      const filters: FilterByTitle = {}
      const sortOptions: SortOption = {}

      let page = Number(req.query.page) || 1
      const perPage = Number(req.query.perPage) || 10
      const totalBooks = await Book.countDocuments()
      const totalPage = Math.ceil(totalBooks / perPage)
      if (title && typeof title === 'string') {
        filters.title = { $regex: new RegExp(title, 'i') }
      }
      if (author && typeof author === 'string') {
        filters.authorId = author
      }

      // ! not completed
      if (sortByPrice && typeof sortByPrice === 'string') {
        if (sortByPrice === 'asc') {
          sortOptions.sortByPrice = { price: 1 }
        }
        if (sortByPrice === 'desc') {
          sortOptions.sortByPrice = { price: -1 }
        }
      }
      if (page > totalPage) {
        page = totalPage
      }

      const books = await Book.find(filters)
        // .sort(sortOptions.sortByPrice)
        // .skip((page - 1) * perPage)
        .limit(perPage)
        .populate('authorId')

      res.json({
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
      // Check book already exists or not
      const { image, title, description, isAvailable, bookCopiesQty, price } =
        // : BookDocument
        // req.body as BookSchemaType
        req.body as BookDocument
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
        isAvailable,
        bookCopiesQty,
        price,
      })
      console.log(book)

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
