import { Router } from 'express'
import { getAllBooks, getBookById } from '../controllers/bookController'

const router = Router()

// GET /api/books -> Get all books
router.get('/', getAllBooks)

// GET /api/books/:id -> Get book by Id
router.get('/:id', getBookById)

export default router
