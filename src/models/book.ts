import { Schema, model } from 'mongoose'

export type BookDocument = Document & {
  image: string
  title: string
  description: string
  authorsId: Schema.Types.ObjectId[]
  isAvailable: boolean
  bookCopiesQty: Number
  price: Number
}

const bookSchema = new Schema(
  {
    image: {
      type: String,
      // required: true,
      default: 'public/images/books/default.png',
    },
    title: {
      type: String,
      required: true,
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
      // required: true,
      trim: true,
      default: 1,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export const Book = model<BookDocument>('Book', bookSchema)
