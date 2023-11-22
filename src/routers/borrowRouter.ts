import express from 'express'
const router = express.Router()

import Borrow from '../models/borrow'
import ApiError from '../errors/ApiError'

import borrowController from '../controllers/borrowController'
const borrow = new borrowController()

router.get('/', borrow.getAllBorrows)

router.post('/', borrow.addBorrow)

router.put('/:id', borrow.updateBorrow)

router.delete('/:id', borrow.deleteBorrow)

export default router
