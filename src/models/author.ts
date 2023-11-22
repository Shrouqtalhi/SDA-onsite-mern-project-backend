import mongoose, { Document } from 'mongoose'

export type AuthorDocument = Document & {
  name: string
  books: mongoose.Schema.Types.ObjectId[]
}

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  books: {
    type: [mongoose.Schema.Types.ObjectId],
    // ref: 'Book',
  },
})

export default mongoose.model<AuthorDocument>('Author', authorSchema)
