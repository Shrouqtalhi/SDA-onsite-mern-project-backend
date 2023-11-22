import { Router } from 'express'
import { getAllBooks } from '../controllers/bookController'

const router = Router()

// GET /api/books -> Get all books
router.get('/', getAllBooks)

export default router
