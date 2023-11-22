import express from 'express'
const router = express.Router()

import Author from '../models/author'
import ApiError from '../errors/ApiError'

router.get('/', async (req, res) => {
  const authors = await Author.find()
  res.status(200).json(authors)
})

router.post('/', async (req, res, next) => {
  const newAuthor = req.body

  if (!newAuthor) {
    next(ApiError.badRequest('body is required'))
  }

  // const author = new Author(newAuthor)
  // await author.save()
  const author = await Author.create(newAuthor)

  res.status(200).json({ message: 'new Author saved', payload: author })
})

router.put('/:id', async (req, res, next) => {
  const authorId = req.params.id
  const author = req.body

  const newAuthor = await Author.findByIdAndUpdate(authorId, author)
  if (!newAuthor) {
    res.status(404).json({ message: 'author not found' })
    next(ApiError.badRequest('author not found'))
  }
  res.status(200).json({ message: 'author updated', payload: author })
})

router.delete('/:id', async (req, res, next) => {
  const authorId = req.params.id

  const author = await Author.findByIdAndDelete(authorId)
  if (!author) {
    res.status(404).json({ message: 'author not found' })
    next(ApiError.badRequest('author not found'))
  }

  res.status(200).json({ message: 'author deleted', payload: author })
})

export default router
