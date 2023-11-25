import { Router } from 'express'
import {
  addAuthors,
  createNewBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from '../controllers/bookController'
import validate from '../middlewares/validate'
import { bookSchema } from '../zod/bookSchema'

const router = Router()

// GET /api/books -> Get all books
router.get('/', getAllBooks)

// PUT /api/books/authors -> Add authors to books
router.put('/authors', addAuthors)
// GET /api/books/:id -> Get book by Id
router.get('/:id', getBookById)

// POST /api/books -> Create new book
router.post('/', validate(bookSchema), createNewBook)

// DELETE /api/books/:id -> Delete book by Id
router.delete('/:id', deleteBook)

// PUT /api/books/:id -> Update book
router.put('/:id', updateBook)

// router.put('/authors', addAuthors)
// router.get('/authors', getAllBooks)

export default router
