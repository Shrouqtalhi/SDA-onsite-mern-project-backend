import mongoose, { Document } from 'mongoose'

export type BorrowDocument = Document & {
  userId: mongoose.Schema.Types.ObjectId
  bookId: mongoose.Schema.Types.ObjectId
  borrowDate: Date
  returnDate: Date | null
  dueDate: Date
}

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  borrowDate: {
    type: Date,
    default: () => Date.now(),
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
    required: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
})

export default mongoose.model<BorrowDocument>('Borrow', borrowSchema)
// export default mongoose.model<OrderDocument>('Order', orderSchema)
