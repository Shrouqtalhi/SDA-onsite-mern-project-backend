import express from 'express'
const router = express.Router()

import Borrow from '../models/borrow'
import ApiError from '../errors/ApiError'

import validate from '../middlewares/validate'
import borrowController from '../controllers/borrowController'
import { borrowSchema } from '../zod/borrowSchema'
const borrow = new borrowController()

router.get('/', borrow.getAllBorrows)
router.post('/', validate(borrowSchema), borrow.addBorrow)
router.put('/:id', borrow.updateBorrow)
router.delete('/:id', borrow.deleteBorrow)
router.put('/return/:id', borrow.ReturnBorrowedBook)

export default router
