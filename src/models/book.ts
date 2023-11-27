import { Schema, model } from 'mongoose'

export type BookDocument = {
  // image: string
  title: string
  description: string
  authorsId: Schema.Types.ObjectId[]
  isAvailable: number
  bookCopiesQty: Number
}

const bookSchema = new Schema({
  // image: {
  //   type: String,
  //   // required: true,
  //   trim: true,
  // },
  title: {
    type: String,
    // required: true,
    trim: true,
    minlength: [2, 'Book title must be at least 3 characters long'],
    maxlength: [300, 'Book title must be at most 300 characters long'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Book description must be at least 3 characters long'],
  },
  authorsId: {
    type: [Schema.Types.ObjectId],
    ref: 'Author',
  },
  isAvailable: {
    type: Number,
    required: true,
    min: 0,
  },
  bookCopiesQty: {
    type: Number,
    // required: true,
    trim: true,
    default: 1,
    min: 0,
  },
})

export const Book = model<BookDocument>('Book', bookSchema)
