import { Request, Response, NextFunction } from 'express'
import Author, { AuthorDocument } from '../models/author'
import ApiError from '../errors/ApiError'
import { Book } from '../models/book'

export default class authorController {
  async getAllAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await Author.find().populate('books')
      const authorsWithBooks = await Book.populate(authors, {
        path: 'books.authors',
        model: 'Author',
      })
      console.log(authorsWithBooks)
      res.status(200).json(authorsWithBooks)
      // res.status(200).json(authors)
    } catch (error) {
      console.error('Error fetching authors:', error)
      next(ApiError.internal('Internal server error'))
    }
  }

  async addAuthor(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body as AuthorDocument

    if (!name) {
      next(ApiError.badRequest('Author is required'))
      return
    }

    const author = new Author({
      name,
    })

    await author.save()

    res.status(200).json({ message: 'new Author saved', payload: author })
  }

  async updateAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.id
    const author = req.body

    const newAuthor = await Author.findByIdAndUpdate(authorId, author)
    if (!newAuthor) {
      res.status(404).json({ message: 'author not found' })
      next(ApiError.badRequest('author not found'))
      return
    }
    res.status(200).json({ message: 'author updated', payload: author })
  }

  async deleteAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.id

    const author = await Author.findByIdAndDelete(authorId)
    if (!author) {
      res.status(404).json({ message: 'author not found' })
      next(ApiError.badRequest('author not found'))
      return
    }

    res.status(200).json({ message: 'author deleted', payload: author })
  }

  async getAuthorById(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.id

    const author = await Author.findById(authorId)
    if (!author) {
      res.status(404).json({ message: 'author not found' })
      next(ApiError.badRequest('author not found'))
      return
    }

    res.status(200).json({ message: `author with id ${authorId} found`, payload: author })
  }
}
