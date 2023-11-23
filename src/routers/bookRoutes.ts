import { Router } from 'express'
import {
  createNewBook,
  deleteBook,
  //   deleteBookBySlug,
  getAllBooks,
  getBookById,
  //   getBookBySlug,
  updateBook,
} from '../controllers/bookController'

const router = Router()

// GET /api/books -> Get all books
router.get('/', getAllBooks)

// GET /api/books/:id -> Get book by Id
router.get('/:id', getBookById)

// // GET /api/books/:slug -> Get book by slug
// router.get('/slug', getBookBySlug)

// // GET /api/books/:slug -> Get book by slug
// router.delete('/:slug', deleteBookBySlug)

// POST /api/books -> Create new book
router.post('/', createNewBook)

// DELETE /api/books/:id -> Delete book by Id
router.delete('/:id', deleteBook)

// PUT /api/books/:id -> Delete book
router.put('/:id', updateBook)

export default router
