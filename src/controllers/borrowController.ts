import { Request, Response, NextFunction } from 'express'
import Borrow from '../models/borrow'
import ApiError from '../errors/ApiError'

export default class BorrowController {
  async getAllBorrows(req: Request, res: Response) {
    const borrows = await Borrow.find()
    res.status(200).json(borrows)
  }

  async addBorrow(req: Request, res: Response, next: NextFunction) {
    const newBorrow = req.body

    if (!newBorrow) {
      next(ApiError.badRequest('body is required'))
    }

    // const borrow = new Borrow(newBorrow)
    // await borrow.save()
    const borrow = await Borrow.create(newBorrow)

    res.status(200).json({ message: 'new Borrow saved', payload: borrow })
  }

  async updateBorrow(req: Request, res: Response, next: NextFunction) {
    const borrowId = req.params.id
    const borrow = req.body

    const newBorrow = await Borrow.findByIdAndUpdate(borrowId, borrow)
    if (!newBorrow) {
      res.status(404).json({ message: 'borrow not found' })
      next(ApiError.badRequest('borrow not found'))
    }
    res.status(200).json({ message: 'borrow updated', payload: borrow })
  }

  async deleteBorrow(req: Request, res: Response, next: NextFunction) {
    const borrowId = req.params.id

    const borrow = await Borrow.findByIdAndDelete(borrowId)
    if (!borrow) {
      res.status(404).json({ message: 'borrow not found' })
      next(ApiError.badRequest('borrow not found'))
    }

    res.status(200).json({ message: 'borrow deleted', payload: borrow })
  }
}
