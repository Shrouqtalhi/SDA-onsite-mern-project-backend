import { Schema, model } from 'mongoose'

export type BookDocument = {
  image: string
  title: string
  description: string
  authorId: Schema.Types.ObjectId[]
  isAvailable: boolean
  bookCopiesQty: Number
}

const bookSchema = new Schema({
  image: {
    type: String,
    // required: true,
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
    type: [Schema.Types.ObjectId],
    ref: 'Author',
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
  bookCopiesQty: {
    type: Number,
    required: true,
    trim: true,
  },
})

export const Book = model('Book', bookSchema)
