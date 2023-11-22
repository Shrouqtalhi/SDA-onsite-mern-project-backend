import { Schema, model } from 'mongoose'

const bookSchema = new Schema({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Book title must be at least 3 characters long'],
    maxlength: [300, 'Book title must be at most 300 characters long'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Book description must be at least 3 characters long'],
  },
  authorId: {
    type: Number,
    required: true,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  bookCopiesQty: {
    type: Number,
    required: true,
    trim: true,
  },
})

export const Book = model('Books', bookSchema)
