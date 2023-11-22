import { Request, Response, NextFunction } from 'express'
import Author from '../models/author'
import ApiError from '../errors/ApiError'

export default class authorController {
  async getAllAuthors(req: Request, res: Response) {
    const authors = await Author.find()
    res.status(200).json(authors)
  }

  async addAuthor(req: Request, res: Response, next: NextFunction) {
    const newAuthor = req.body

    if (!newAuthor) {
      next(ApiError.badRequest('body is required'))
    }

    // const author = new Author(newAuthor)
    // await author.save()
    const author = await Author.create(newAuthor)

    res.status(200).json({ message: 'new Author saved', payload: author })
  }

  async updateAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.id
    const author = req.body

    const newAuthor = await Author.findByIdAndUpdate(authorId, author)
    if (!newAuthor) {
      res.status(404).json({ message: 'author not found' })
      next(ApiError.badRequest('author not found'))
    }
    res.status(200).json({ message: 'author updated', payload: author })
  }

  async deleteAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.id

    const author = await Author.findByIdAndDelete(authorId)
    if (!author) {
      res.status(404).json({ message: 'author not found' })
      next(ApiError.badRequest('author not found'))
    }

    res.status(200).json({ message: 'author deleted', payload: author })
  }
}
