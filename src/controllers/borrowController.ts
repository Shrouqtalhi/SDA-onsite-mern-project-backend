import { Request, Response, NextFunction } from 'express'
import Borrow, { BorrowDocument } from '../models/borrow'
import ApiError from '../errors/ApiError'
import { BorrowSchemaType } from '../zod/borrowSchema'
import { Book, BookDocument } from '../models/book'
import User from '../models/user'

export default class BorrowController {
  async getAllBorrows(req: Request, res: Response) {
    const borrows = await Borrow.find()
    res.status(200).json(borrows)
  }

  async addBorrow(req: Request, res: Response, next: NextFunction) {
    const { userId, bookId, numberOfDays } = req.body as BorrowSchemaType

    const book = await Book.findById(bookId)
    const user = await User.findById(userId)
    if (!user || !book) {
      next(ApiError.badRequest('Book ID or User ID not found'))
      return
    }
    if (!book.isAvailable) {
      next(ApiError.badRequest('Book Is Not Available'))
      return
    }

    const currentDate = new Date()

    const borrow = new Borrow({
      userId: userId,
      bookId: bookId,
      borrowDate: currentDate,
      returnDate: null,
      dueDate: currentDate.setDate(currentDate.getDate() + numberOfDays),
    })
    await borrow.save()
    user.borrow.push(borrow._id)
    book.isAvailable = false
    await Book.findByIdAndUpdate(bookId, book)
    await User.findByIdAndUpdate(userId, user)

    // const borrow = await Borrow.create(newBorrow)

    res.status(200).json({ message: 'Book borrowed successfully!', payload: borrow })
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

  async ReturnBorrowedBook(req: Request, res: Response, next: NextFunction) {
    const borrowId = req.params.id

    const borrow = await Borrow.findById(borrowId)
    if (!borrow) {
      res.status(404).json({ message: 'borrow not found' })
      next(ApiError.badRequest('borrow not found'))
      return
    }
    const book = await Book.findById(borrow.bookId)
    if (!book) {
      res.status(404).json({ message: 'book not found' })
      next(ApiError.badRequest('book not found'))
      return
    }
    book.isAvailable = true
    await Book.findByIdAndUpdate(book.id, book)

    borrow.returnDate = new Date()
    await Borrow.findByIdAndUpdate(borrow.id, borrow)

    res.status(200).json({ message: 'Book Returned Successfully', payload: borrow })
  }

  async getByUserId(req: Request, res: Response, next: NextFunction) {
    const decodedUser = req.decodedUser
    const borrows = await Borrow.find({ userId: decodedUser.userId }).populate('bookId')

    res.json(borrows)
  }
}
