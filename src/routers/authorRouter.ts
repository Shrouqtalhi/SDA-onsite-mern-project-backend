import express from 'express'
const router = express.Router()

import Author from '../models/author'
import ApiError from '../errors/ApiError'

import authorController from '../controllers/authorController'
const author = new authorController()

router.get('/', author.getAllAuthors)

router.post('/', author.addAuthor)

router.put('/:id', author.updateAuthor)

router.delete('/:id', author.deleteAuthor)

export default router
