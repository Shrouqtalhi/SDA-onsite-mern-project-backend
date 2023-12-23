import { Router } from 'express'
import bookController from '../controllers/bookController'
import validate from '../middlewares/validate'
import { bookSchema } from '../zod/bookSchema'
import { upload } from '../middlewares/uploadFile'

const router = Router()

const book = new bookController()

// GET /api/books -> Get all books
router.get('/', book.getAllBooks)

// PUT /api/books/authors -> Add authors to books
router.put('/authors', book.addAuthors)

// GET /api/books/:id -> Get book by Id
router.get('/:id', book.getBookById)

// POST /api/books -> Create new book
router.post('/', /*upload.single('image'), validate(bookSchema),*/ book.createNewBook)

// DELETE /api/books/:id -> Delete book by Id
router.delete('/:id', book.deleteBook)

// PUT /api/books/:id -> Update book
router.put('/:id', book.updateBook)

export default router
