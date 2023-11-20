import { Request, Response, NextFunction } from 'express'
import Author from '../models/author'

export default class authorController {
  
  async getAllAuthors(req: Request, res: Response) {
    const authors = await Author.find()
    res.status(200).json(authors)
  }

  async addAuthors(req: Request, res: Response, next: NextFunction) {


}
