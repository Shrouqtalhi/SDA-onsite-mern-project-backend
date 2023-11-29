import express from 'express'
const router = express.Router()

import Author from '../models/author'
import ApiError from '../errors/ApiError'

import validate from '../middlewares/validate'
import authorController from '../controllers/authorController'
import { authorSchema } from '../zod/authorSchema'
const author = new authorController()

router.get('/', author.getAllAuthors)

router.post('/', validate(authorSchema), author.addAuthor)

router.put('/:id', author.updateAuthor)

router.delete('/:id', author.deleteAuthor)

export default router
